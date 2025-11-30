import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    // Load Test - theo yêu cầu 100, 500, 1000 users
    { duration: "1m", target: 100 },   
    { duration: "2m", target: 500 },    
    { duration: "1m", target: 700 }, 
    { duration: "2m", target: 1000 },  
    { duration: "2m", target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'], // 95% requests < 3s
    http_req_failed: ['rate<0.05'],    // Error rate < 5%
  },
};

export default function () {
  const url = "http://host.docker.internal:8080/api/auth/login";
  const payload = JSON.stringify({
    username: "adminhehe",
    password: "123456abc",
  });
  
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
    timeout: "10s",
  };
  
  const res = http.post(url, payload, params);
  
  check(res, {
    "status is 200": (r) => r.status === 200,
    "response time < 2s": (r) => r.timings.duration < 2000,
    "response time < 5s": (r) => r.timings.duration < 5000,
  });
  
  sleep(1);
}