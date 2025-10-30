// src/tests/Login.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../components/login";
import { login } from "../services/authService";

jest.mock("../services/authService");

describe("Login Component Tests", () => {
  afterEach(() => jest.clearAllMocks());

  test("TC01 - Login thành công hiển thị message", async () => {
    login.mockResolvedValueOnce({
      success: true,
      message: "Dang nhap thanh cong",
      token: "abc123",
    });

    render(<Login />);
    fireEvent.change(screen.getByTestId("username-input"), { target: { value: "admin" } });
    fireEvent.change(screen.getByTestId("password-input"), { target: { value: "123456" } });
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() =>
      expect(screen.getByTestId("message").textContent).toBe("Dang nhap thanh cong")
    );
  });

  test("TC02 - Login thất bại với username không tồn tại", async () => {
    login.mockRejectedValueOnce(new Error("Username khong ton tai"));

    render(<Login />);
    fireEvent.change(screen.getByTestId("username-input"), { target: { value: "khongtontai" } });
    fireEvent.change(screen.getByTestId("password-input"), { target: { value: "123456" } });
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() =>
      expect(screen.getByTestId("message").textContent).toBe("Username khong ton tai")
    );
  });

  test("TC03 - Login thất bại với password sai", async () => {
    login.mockRejectedValueOnce(new Error("Mat khau khong chinh xac"));

    render(<Login />);
    fireEvent.change(screen.getByTestId("username-input"), { target: { value: "admin" } });
    fireEvent.change(screen.getByTestId("password-input"), { target: { value: "passsai" } });
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() =>
      expect(screen.getByTestId("message").textContent).toBe("Mat khau khong chinh xac")
    );
  });

  test("TC04 - Username null", async () => {
    login.mockRejectedValueOnce(new Error("Username không được để trống"));

    render(<Login />);
    fireEvent.change(screen.getByTestId("username-input"), { target: { value: "" } });
    fireEvent.change(screen.getByTestId("password-input"), { target: { value: "123456" } });
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() =>
      expect(screen.getByTestId("message").textContent).toBe("Username không được để trống")
    );
  });

  test("TC05 - Password null", async () => {
    login.mockRejectedValueOnce(new Error("Password không được để trống"));

    render(<Login />);
    fireEvent.change(screen.getByTestId("username-input"), { target: { value: "admin" } });
    fireEvent.change(screen.getByTestId("password-input"), { target: { value: "" } });
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() =>
      expect(screen.getByTestId("message").textContent).toBe("Password không được để trống")
    );
  });

  test("TC06 - Username và password null", async () => {
    login.mockRejectedValueOnce(new Error("Username và password không được để trống"));

    render(<Login />);
    fireEvent.change(screen.getByTestId("username-input"), { target: { value: "" } });
    fireEvent.change(screen.getByTestId("password-input"), { target: { value: "" } });
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() =>
      expect(screen.getByTestId("message").textContent).toBe("Username và password không được để trống")
    );
  });
});
