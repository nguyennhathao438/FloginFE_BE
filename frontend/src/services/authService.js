// src/services/authService.js
import api from "./api";
export class AuthService {
  constructor(users) {
    this.users = users || [{ username: "adminhehe", password: "123456abc" }];
  }

  async login(username, password) {
    if (!username && !password)
      throw new Error("Username và password không được để trống");
    if (!username) throw new Error("Username không được để trống");
    if (!password) throw new Error("Password không được để trống");

    const user = this.users.find((u) => u.username === username);
    try {
      const response = await api.post("auth/login", { username, password });
      return response.data.result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

const authInstance = new AuthService();

export const login = async ({ username, password }) => {
  return authInstance.login(username, password);
};
