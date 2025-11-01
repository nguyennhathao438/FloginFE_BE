// src/services/authService.js

export class AuthService {
  constructor(users) {
    this.users = users || [{ username: "admin", password: "123456" }];
  }

  login(username, password) {
    if (!username && !password)
      throw new Error("Username và password không được để trống");
    if (!username) throw new Error("Username không được để trống");
    if (!password) throw new Error("Password không được để trống");

    const user = this.users.find((u) => u.username === username);
    if (!user) throw new Error("Username không tồn tại");

    if (user.password !== password)
      throw new Error("Mật khẩu không chính xác");

    return {
      success: true,
      message: "Đăng nhập thành công",
      token: "abc123",
    };
  }
}

const authInstance = new AuthService();

export const login = async ({ username, password }) => {
  return authInstance.login(username, password);
};
