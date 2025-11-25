import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../../components/Login";
import * as authService from "../../services/authService";
import { MemoryRouter } from "react-router";

//Mock API login service
jest.mock("../../services/authService", () => ({
  login: jest.fn(),
}));

describe("Integration Test - Login Component (6 Test Cases)", () => {
  const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Rendering & User Interactions
  test("TC01 - Hiển thị lỗi khi submit form rỗng", async () => {
    renderWithRouter(<Login />);

    const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Username phải có ít nhất 6 ký tự")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Password phải có ít nhất 6 ký tự")
      ).toBeInTheDocument();
    });
  });

  test("TC02 - Nhập thông tin input và kiểm tra giá trị cập nhật", () => {
    renderWithRouter(<Login />);

    const usernameInput = screen.getByTestId("username-input");
    const passwordInput = screen.getByTestId("password-input");

    fireEvent.change(usernameInput, { target: { value: "admin123" } });
    fireEvent.change(passwordInput, { target: { value: "abc123" } });

    expect(usernameInput.value).toBe("admin123");
    expect(passwordInput.value).toBe("abc123");
  });

  // Form Submission & API Calls
  test("TC03 - Không gọi API khi form không hợp lệ (username sai định dạng)", async () => {
    renderWithRouter(<Login />);

    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "admin@123" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "abc123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Đăng nhập/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Username chỉ được chứa chữ, số và dấu gạch dưới")
      ).toBeInTheDocument();
      expect(authService.login).not.toHaveBeenCalled();
    });
  });

  test("TC04 - Gọi API khi submit form hợp lệ", async () => {
    authService.login.mockResolvedValue({
      success: true,
      message: "Đăng nhập thành công!",
      token: "abc123",
    });

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "admin123" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "abc123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Đăng nhập/i }));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        username: "admin123",
        password: "abc123",
      });
      expect(screen.getByTestId("message")).toHaveTextContent(
        "Đăng nhập thành công!"
      );
    });
  });

  //  Error Handling & Success Messages
  test("TC05 - Hiển thị thông báo lỗi khi đăng nhập thất bại", async () => {
    authService.login.mockRejectedValueOnce({
      response: { data: { message: "Sai tên đăng nhập hoặc mật khẩu" } },
    });

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "wronguser" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "abc123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Đăng nhập/i }));

    await waitFor(() => {
      expect(screen.getByTestId("message")).toHaveTextContent(
        "Sai tên đăng nhập hoặc mật khẩu"
      );
    });
  });

  test("TC06 - Reset form sau khi đăng nhập thành công", async () => {
    authService.login.mockResolvedValue({
      success: true,
      message: "Đăng nhập thành công!",
      token: "abc123",
    });

    renderWithRouter(<Login />);

    const usernameInput = screen.getByTestId("username-input");
    const passwordInput = screen.getByTestId("password-input");

    fireEvent.change(usernameInput, { target: { value: "admin123" } });
    fireEvent.change(passwordInput, { target: { value: "abc123" } });

    fireEvent.click(screen.getByRole("button", { name: /Đăng nhập/i }));

    await waitFor(() => {
      expect(screen.getByTestId("message")).toHaveTextContent(
        "Đăng nhập thành công!"
      );
      expect(usernameInput.value).toBe("");
      expect(passwordInput.value).toBe("");
    });
  });
});
