// src/tests/Login.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../../components/Login";
import { login as loginService } from "../../services/authService";
import { MemoryRouter } from "react-router";
jest.mock("../../services/authService");

describe("Login Mock Tests", () => {
  const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Mock: Login thành công", async () => {
    loginService.mockResolvedValueOnce({
      message: "Đăng nhập thành công!",
    });

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "Test123" },
    });
    fireEvent.click(screen.getByTestId("login-btn"));

    await waitFor(() => {
      expect(loginService).toHaveBeenCalledWith({
        username: "testuser",
        password: "Test123",
      });

      expect(screen.getByTestId("message")).toHaveTextContent(
        "Đăng nhập thành công!"
      );
    });
  });

  test("Mock: Login thất bại", async () => {
    loginService.mockRejectedValueOnce({
      message: "Sai tên đăng nhập hoặc mật khẩu",
    });

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "wronguser" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "Wrong123" },
    });
    fireEvent.click(screen.getByTestId("login-btn"));

    await waitFor(() => {
      expect(loginService).toHaveBeenCalledWith({
        username: "wronguser",
        password: "Wrong123",
      });

      expect(screen.getByTestId("message")).toHaveTextContent(
        "Sai tên đăng nhập hoặc mật khẩu"
      );
    });
  });
});
