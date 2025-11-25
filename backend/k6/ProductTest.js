import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = "http://host.docker.internal:8080/api";
const AUTH_URL = `${BASE_URL}/auth/login`;

export const options = {
  stages: [
    { duration: "1m", target: 100 },   
    { duration: "1m", target: 200 },   
    { duration: "2m", target: 400 },  
    { duration: "1m", target: 0 },     
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.05'],
  },
};

// Setup function để login 1 lần và share token cho tất cả VUs
export function setup() {
  console.log("Setting up authentication...");
  
  const loginPayload = JSON.stringify({
    username: "adminhehe",
    password: "123456abc"
  });
  
  const loginParams = {
    headers: { "Content-Type": "application/json" },
    timeout: "10s",
  };
  
  const loginRes = http.post(AUTH_URL, loginPayload, loginParams);
  
  if (loginRes.status === 200 && loginRes.json().code === 200) {
    const token = loginRes.json().result.token;
    console.log("Successfully got auth token");
    return { authToken: token };
  } else {
    console.log(`Login failed - Status: ${loginRes.status}`);
    console.log(`Response: ${loginRes.body}`);
    return { authToken: null };
  }
}

export default function (data) {
  // Nếu không có token, skip test
  if (!data.authToken) {
    console.log("No auth token available, skipping iteration");
    sleep(1);
    return;
  }

  const params = {
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${data.authToken}`
    },
    timeout: "10s",
  };

  // 1. TẠO SẢN PHẨM
  const newProductPayload = JSON.stringify({
    name: `Test Product ${__VU}-${Date.now()}`,
    price: 100.5,
    quantity: 10,
    description: "Sản phẩm test hiệu năng",
    category: "PHONE",
  });

  const createRes = http.post(`${BASE_URL}/products/create`, newProductPayload, params);
  
  let productId = null;
  
  const createSuccess = check(createRes, {
    "create product status 2xx": (r) => r.status >= 200 && r.status < 300,
    "create response time < 2s": (r) => r.timings.duration < 2000,
  });

  // Debug log nếu create failed
  if (!createSuccess) {
    console.log(`Create failed - Status: ${createRes.status}, Body: ${createRes.body.substring(0, 200)}`);
  }

  // Lấy productId nếu thành công
  if (createRes.status >= 200 && createRes.status < 300) {
    try {
      const json = createRes.json();
      productId = json.result?.id || json.id || json.data?.id;
      console.log(`Created product ID: ${productId}`);
    } catch (e) {
      console.log('Cannot parse JSON response from create');
    }
  }

  // 2. CHỈ THỰC HIỆN CÁC OPERATIONS KHÁC NẾU CÓ productId
  if (productId) {
    // Lấy danh sách sản phẩm
    const listRes = http.get(`${BASE_URL}/products?page=0&size=10`, params);
    const listSuccess = check(listRes, {
      "list products status 2xx": (r) => r.status >= 200 && r.status < 300,
    });
    if (!listSuccess) {
      console.log(`List failed - Status: ${listRes.status}`);
    }

    // Cập nhật sản phẩm
    const updatePayload = JSON.stringify({
      name: `Updated Product ${__VU}-${Date.now()}`,
      description: "Sản phẩm đã cập nhật",
      price: 150,
      quantity: 5,
      category: "LAPTOP",
    });
    const updateRes = http.put(`${BASE_URL}/products/${productId}`, updatePayload, params);
    const updateSuccess = check(updateRes, {
      "update product status 2xx": (r) => r.status >= 200 && r.status < 300,
    });
    if (!updateSuccess) {
      console.log(`Update failed - Status: ${updateRes.status}`);
    }

    // Lấy thông tin sản phẩm
    const getRes = http.get(`${BASE_URL}/products/${productId}`, params);
    const getSuccess = check(getRes, {
      "get product status 2xx": (r) => r.status >= 200 && r.status < 300,
    });
    if (!getSuccess) {
      console.log(`Get failed - Status: ${getRes.status}`);
    }

    // Xóa sản phẩm - THÊM DEBUG LOG
    const deleteRes = http.del(`${BASE_URL}/products/${productId}`, params);
    const deleteSuccess = check(deleteRes, {
      "delete product status 2xx": (r) => r.status >= 200 && r.status < 300,
    });
    
    if (!deleteSuccess) {
      console.log(`DELETE failed - Status: ${deleteRes.status}`);
      console.log(`DELETE Response: ${deleteRes.body}`);
    } else {
      console.log(`DELETE successful for product ID: ${productId}`);
    }
  } else {
    console.log("No product ID available, skipping other operations");
  }

  sleep(1);
}

// Teardown function (optional)
export function teardown(data) {
  console.log("Test completed");
}