import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "2m", target: 1000 },
    { duration: "2m", target: 2000 },
    { duration: "2m", target: 3000 },
    { duration: "2m", target: 4000 },
    { duration: "2m", target: 5000 },
    { duration: "5m", target: 0 },
  ],
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
  };
  const res = http.post(url, payload, params);
  const resBody = res.json();
  check(res, {
    "status is 200": (r) => r.status === 200,
    "code is 200": () => resBody.code === 200,
    "login success is true": () =>
      resBody.result && resBody.result.succes === true,
    "token exists": () =>
      resBody.result &&
      typeof resBody.result.token === "string" &&
      resBody.result.token.length > 0,
  });
  sleep(1);
}
