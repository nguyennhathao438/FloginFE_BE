import axios from "axios";
import { login } from "../services/authService";

jest.mock("axios"); 

describe("Login Function Unit Tests (Frontend - TDD)", () => {
  afterEach(() => jest.clearAllMocks());

  // TC01
  test("TC01 - Login thành công với credential hợp lệ", async () => {
    axios.post.mockResolvedValueOnce({
      data: { success: true, message: "Dang nhap thanh cong", token: "abc123" },
    });

    const res = await login({ username: "admin", password: "123456" });

    expect(res.success).toBe(true);
    expect(res.message).toBe("Dang nhap thanh cong");
    expect(res.token).toBe("abc123");
  });

  // TC02
  test("TC02 - Login thất bại với username không tồn tại", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: "Username khong ton tai" } },
    });

    await expect(login({ username: "khongtontai", password: "123456" }))
      .rejects.toThrow("Username khong ton tai");
  });

  // TC03
  test("TC03 - Login thất bại với password sai", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: "Mat khau khong chinh xac" } },
    });

    await expect(login({ username: "admin", password: "passsai" }))
      .rejects.toThrow("Mat khau khong chinh xac");
  });

  //  TC04
  test("TC04 - Username null", async () => {
    await expect(login({ username: null, password: "123456" }))
      .rejects.toThrow("Username không được để trống");
  });

  //  TC05
  test("TC05 - Password null", async () => {
    await expect(login({ username: "admin", password: null }))
      .rejects.toThrow("Password không được để trống");
  });

  //  TC06
  test("TC06 - Username và password đều null", async () => {
    await expect(login({ username: null, password: null }))
      .rejects.toThrow("Username và password không được để trống");
  });
});
