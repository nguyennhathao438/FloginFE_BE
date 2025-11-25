import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "1m", target: 100 },
    { duration: "2m", target: 500 },
    { duration: "2m", target: 1000 },
    { duration: "1m", target: 0 },
  ],
};

const BASE_URL = "http://host.docker.internal:8080/api/products";
export default function () {
  let isCreated = false;
  // 1. Tạo sản phẩm mới
  const newProductPayload = JSON.stringify({
    name: `Test Product ${__VU}-${Date.now()}`,
    price: 100.5,
    quantity: 10,
    description: "Sản phẩm test hiệu năng",
    category: "PHONE",
  });

  let params = {
    headers: { "Content-Type": "application/json" },
  };

  let createRes = http.post(`${BASE_URL}/create`, newProductPayload, params);
  if (createRes.status === 200 && createRes.json("code") === 201) {
    const id = createRes.json("result.id");
    isCreated = true;
  }
  check(createRes, {
    "create product status 201": (r) =>
      r.status === 200 && r.json("code") === 201,
  });
  if (isCreated) {
    const productId = createRes.json("result.id");

    // 2. Lấy danh sách sản phẩm
    let listRes = http.get(`${BASE_URL}?page=0&size=10`);
    check(listRes, {
      "list products status 200": (r) =>
        r.status === 200 && r.json("code") === 200,
    });

    // 3. Cập nhật sản phẩm
    const updatePayload = JSON.stringify({
      name: `Updated Product ${__VU}-${Date.now()}`,
      description: "Sản phẩm đã cập nhật",
      price: 150,
      quantity: 5,
      category: "LAPTOP",
    });

    let updateRes = http.put(`${BASE_URL}/${productId}`, updatePayload, params);
    check(updateRes, {
      "update product status 200": (r) =>
        r.status === 200 && r.json("code") === 200,
    });

    // 4. Lấy thông tin sản phẩm theo id
    let getRes = http.get(`${BASE_URL}/${productId}`);
    check(getRes, {
      "get product status 200": (r) =>
        r.status === 200 && r.json("code") === 200,
    });

    // 5. Xóa sản phẩm
    let deleteRes = http.del(`${BASE_URL}/${productId}`);
    check(deleteRes, {
      "delete product status 200": (r) =>
        r.status === 200 && r.json("code") === 200,
    });

    sleep(1);
  }
}
