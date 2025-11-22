// Login.test.js
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { login as loginService } from '../services/authService';

// Mock các dependencies
jest.mock('../services/authService');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));
jest.mock('../storage/useAuthStore');

const mockLoginService = loginService;

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <Login onSwitchToRegister={jest.fn()} />
    </BrowserRouter>
  );
};

describe('Login Lock Feature', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('khóa tài khoản sau 5 lần thất bại', async () => {
    mockLoginService.mockRejectedValue(new Error('Invalid credentials'));
    
    renderLogin();

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const loginButton = screen.getByTestId('login-btn');

    // Thực hiện 5 lần đăng nhập sai
    for (let i = 1; i <= 5; i++) {
      await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
        fireEvent.click(loginButton);
      });

      await waitFor(() => {
        const message = screen.getByTestId('message');
        if (i < 5) {
          expect(message).toHaveTextContent(`Bạn còn ${5 - i} lần thử`);
        }
      });
    }

    // Kiểm tra thông báo khóa
    await waitFor(() => {
      const message = screen.getByTestId('message');
      expect(message).toHaveTextContent('Tài khoản bị khóa trong 5 phút');
    });

    // Kiểm tra nút login bị disabled
    expect(loginButton).toBeDisabled();
    expect(loginButton).toHaveTextContent(/Bị khóa/);

    // Kiểm tra localStorage
    expect(localStorage.getItem('loginLockUntil')).not.toBeNull();
    expect(localStorage.getItem('failedLoginAttempts')).toBe('5');
  });

  test('reset khi đăng nhập thành công', async () => {
    // Giả lập 3 lần thất bại trước đó
    localStorage.setItem('failedLoginAttempts', '3');
    
    mockLoginService.mockResolvedValue({
      token: 'valid-token',
      username: 'testuser',
      message: 'Đăng nhập thành công'
    });

    renderLogin();

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const loginButton = screen.getByTestId('login-btn');

    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'correctpassword' } });
      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(mockLoginService).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'correctpassword'
      });
    });

    // Kiểm tra reset failed attempts
    expect(localStorage.getItem('failedLoginAttempts')).toBeNull();
    expect(localStorage.getItem('loginLockUntil')).toBeNull();
  });

  test('Khôi phục trạng thái từ localStorage', async () => {
    // Giả lập tài khoản đang bị khóa
    const lockTime = Date.now() + 300000; // 5 phút từ bây giờ
    localStorage.setItem('loginLockUntil', lockTime.toString());
    localStorage.setItem('failedLoginAttempts', '5');

    renderLogin();

    const loginButton = screen.getByTestId('login-btn');
    const message = screen.getByTestId('message');

    // Kiểm tra nút bị disabled và thông báo khóa
    expect(loginButton).toBeDisabled();
    expect(message).toHaveTextContent(/Bị khóa/);
  });

  test('Ngăn chặn đăng nhập kho bị khóa', async () => {
    // Giả lập tài khoản đang bị khóa
    const lockTime = Date.now() + 300000;
    localStorage.setItem('loginLockUntil', lockTime.toString());
    localStorage.setItem('failedLoginAttempts', '5');

    renderLogin();

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const loginButton = screen.getByTestId('login-btn');

    // Thử đăng nhập khi bị khóa
    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'anypassword' } });
      fireEvent.click(loginButton);
    });

    // Kiểm tra không gọi API login
    expect(mockLoginService).not.toHaveBeenCalled();

    // Kiểm tra thông báo khóa vẫn hiển thị
    const message = screen.getByTestId('message');
    expect(message).toHaveTextContent(/Bị khóa/);
  });
});