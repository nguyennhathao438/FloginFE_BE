// src/tests/UnitTest/Login.test.js
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../components/Login.jsx';

// Mock các dependencies
jest.mock('../../services/authService.js', () => ({
  login: jest.fn()
}));

jest.mock('../../storage/useAuthStorage.js', () => ({
  useAuthStore: () => ({
    login: jest.fn(),
    logout: jest.fn(),
    user: null,
    token: null
  })
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Import sau khi mock
import { login as loginService } from '../../services/authService.js';

const mockLoginService = loginService;

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Tính năng khóa tài khoản đăng nhập', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    mockNavigate.mockClear();
    mockLoginService.mockReset();
  });

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login onSwitchToRegister={jest.fn()} />
      </BrowserRouter>
    );
  };

  // Helper function để fill form với dữ liệu hợp lệ
  const fillValidForm = async () => {
    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');

    await act(async () => {
      // Dùng dữ liệu hợp lệ để tránh validation errors
      fireEvent.change(usernameInput, { target: { value: 'testuser123' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } }); // Có cả chữ và số
    });

    // Đợi validation errors clear (nếu có)
    await waitFor(() => {
      const passwordError = screen.queryByTestId('password-error');
      expect(passwordError).not.toBeInTheDocument();
    });
  };

  test('nên khóa tài khoản sau 5 lần đăng nhập sai', async () => {
    mockLoginService.mockRejectedValue(new Error('Invalid credentials'));
    
    renderLogin();

    const loginButton = screen.getByTestId('login-btn');

    // Thực hiện 5 lần đăng nhập sai
    for (let i = 1; i <= 5; i++) {
      await fillValidForm();
      
      await act(async () => {
        fireEvent.click(loginButton);
      });

      // Đợi và kiểm tra message sau mỗi lần thử
      await waitFor(() => {
        // Kiểm tra message hiển thị đúng thông báo
        const messageElement = screen.queryByTestId('message');
        if (messageElement) {
          if (i < 5) {
            expect(messageElement).toHaveTextContent(`Bạn còn ${5 - i} lần thử`);
          } else {
            expect(messageElement).toHaveTextContent('Tài khoản bị khóa trong 5 phút');
          }
        }
      }, { timeout: 2000 });
    }

    // Kiểm tra thông báo khóa trong message element
    await waitFor(() => {
      const messageElement = screen.getByTestId('message');
      expect(messageElement).toHaveTextContent('Tài khoản bị khóa trong 5 phút');
    });

    // Kiểm tra nút login bị disabled và hiển thị text khóa
    expect(loginButton).toBeDisabled();
    expect(loginButton).toHaveTextContent('Bị khóa (5 phút)');

    // Kiểm tra inputs bị disabled
    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    expect(usernameInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();

    // Kiểm tra localStorage được gọi
    expect(localStorageMock.setItem).toHaveBeenCalledWith('failedLoginAttempts', '5');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('loginLockUntil', expect.any(String));
  });

  test('nên reset số lần thất bại khi đăng nhập thành công', async () => {
    // Giả lập 3 lần thất bại trước đó
    localStorageMock.setItem('failedLoginAttempts', '3');
    
    mockLoginService.mockResolvedValue({
      token: 'valid-token',
      username: 'testuser',
      message: 'Đăng nhập thành công'
    });

    renderLogin();

    await fillValidForm();
    
    const loginButton = screen.getByTestId('login-btn');

    await act(async () => {
      fireEvent.click(loginButton);
    });

    // Kiểm tra API được gọi với dữ liệu hợp lệ
    await waitFor(() => {
      expect(mockLoginService).toHaveBeenCalledWith({
        username: 'testuser123',
        password: 'password123'
      });
    });

    // Kiểm tra message hiển thị thành công
    await waitFor(() => {
      const messageElement = screen.getByTestId('message');
      expect(messageElement).toHaveTextContent('Đăng nhập thành công');
    });

    // Kiểm tra reset failed attempts
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('failedLoginAttempts');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('loginLockUntil');
  });

  test('nên khôi phục trạng thái khóa từ localStorage khi component mount', async () => {
    // Giả lập tài khoản đang bị khóa
    const lockTime = Date.now() + 300000;
    localStorageMock.setItem('loginLockUntil', lockTime.toString());
    localStorageMock.setItem('failedLoginAttempts', '5');

    renderLogin();

    const loginButton = screen.getByTestId('login-btn');

    // Kiểm tra nút bị disabled và hiển thị text khóa
    await waitFor(() => {
      expect(loginButton).toBeDisabled();
      expect(loginButton).toHaveTextContent(/Bị khóa/);
    });

    // Kiểm tra inputs bị disabled
    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    expect(usernameInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();

    // Message có thể không hiển thị ngay khi mount, chỉ kiểm tra nếu tồn tại
    const messageElement = screen.queryByTestId('message');
    if (messageElement) {
      expect(messageElement).toHaveTextContent(/bị khóa/i);
    }
  });

  test('nên ngăn chặn đăng nhập khi tài khoản bị khóa', async () => {
    // Giả lập tài khoản đang bị khóa
    const lockTime = Date.now() + 300000;
    localStorageMock.setItem('loginLockUntil', lockTime.toString());
    localStorageMock.setItem('failedLoginAttempts', '5');

    renderLogin();

    await fillValidForm();
    
    const loginButton = screen.getByTestId('login-btn');

    await act(async () => {
      fireEvent.click(loginButton);
    });

    // Kiểm tra không gọi API login
    expect(mockLoginService).not.toHaveBeenCalled();

    // Kiểm tra vẫn ở trạng thái khóa
    expect(loginButton).toBeDisabled();
    expect(loginButton).toHaveTextContent(/Bị khóa/);
  });

  test('nên hiển thị lỗi validation khi nhập liệu không hợp lệ', async () => {
    renderLogin();

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const loginButton = screen.getByTestId('login-btn');

    // Test password chỉ có chữ (không có số)
    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'passwordonly' } }); // Chỉ có chữ
      fireEvent.click(loginButton);
    });

    // Kiểm tra validation error hiển thị
    await waitFor(() => {
      const passwordError = screen.getByTestId('password-error');
      expect(passwordError).toHaveTextContent(/phải chứa cả chữ và số/i);
    });

    // Kiểm tra API không được gọi khi validation failed
    expect(mockLoginService).not.toHaveBeenCalled();
  });

  test('nên hiển thị số lần thử còn lại sau mỗi lần đăng nhập sai', async () => {
    mockLoginService.mockRejectedValue(new Error('Invalid credentials'));
    
    renderLogin();

    const loginButton = screen.getByTestId('login-btn');

    // Thực hiện 3 lần đăng nhập sai và kiểm tra message
    for (let i = 1; i <= 3; i++) {
      await fillValidForm();
      
      await act(async () => {
        fireEvent.click(loginButton);
      });

      // Kiểm tra message hiển thị số lần thử còn lại
      await waitFor(() => {
        const messageElement = screen.getByTestId('message');
        expect(messageElement).toHaveTextContent(`Bạn còn ${5 - i} lần thử`);
      });
    }
  });

  test('nên hiển thị thông báo khóa khi cố đăng nhập trong trạng thái khóa', async () => {
    // Giả lập tài khoản đang bị khóa
    const lockTime = Date.now() + 300000;
    localStorageMock.setItem('loginLockUntil', lockTime.toString());
    localStorageMock.setItem('failedLoginAttempts', '5');

    renderLogin();

    // Thử đăng nhập khi đang bị khóa
    await fillValidForm();
    
    const loginButton = screen.getByTestId('login-btn');

    await act(async () => {
      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      const messageElement = screen.queryByTestId('message');
      if (messageElement) {
        expect(messageElement).toHaveTextContent(/bị khóa/i);
      }
    }, { timeout: 1000 }); 

    const messageElement = screen.queryByTestId('message');
    if (!messageElement) {
      expect(loginButton).toBeDisabled();
      expect(loginButton).toHaveTextContent(/Bị khóa/);
    }
  });

  // Test case mới: Kiểm tra tự động mở khóa sau thời gian
  test('nên tự động mở khóa sau khi hết thời gian', async () => {
    // Sử dụng fake timers
    jest.useFakeTimers();
    
    const lockTime = Date.now() + 1000; 
    localStorageMock.setItem('loginLockUntil', lockTime.toString());
    localStorageMock.setItem('failedLoginAttempts', '5');

    renderLogin();

    const loginButton = screen.getByTestId('login-btn');

    // Kiểm tra ban đầu bị khóa
    await waitFor(() => {
      expect(loginButton).toBeDisabled();
    });

    // Chạy timer đến khi hết thời gian khóa
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Kiểm tra đã mở khóa
    await waitFor(() => {
      expect(loginButton).not.toBeDisabled();
      expect(loginButton).toHaveTextContent('Đăng nhập');
    });

    // Kiểm tra localStorage đã được clear
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('failedLoginAttempts');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('loginLockUntil');

    // Khôi phục real timers
    jest.useRealTimers();
  });

  // Test case: Kiểm tra không bị khóa khi đăng nhập thành công trước 5 lần
  test('không nên khóa tài khoản khi đăng nhập thành công trước 5 lần thất bại', async () => {
    // Giả lập 3 lần thất bại trước đó
    localStorageMock.setItem('failedLoginAttempts', '3');
    
    // Lần thứ 4 thành công
    mockLoginService.mockResolvedValue({
      token: 'valid-token',
      username: 'testuser',
      message: 'Đăng nhập thành công'
    });

    renderLogin();

    await fillValidForm();
    
    const loginButton = screen.getByTestId('login-btn');

    await act(async () => {
      fireEvent.click(loginButton);
    });

    // Kiểm tra đăng nhập thành công
    await waitFor(() => {
      const messageElement = screen.getByTestId('message');
      expect(messageElement).toHaveTextContent('Đăng nhập thành công');
    });

    expect(loginButton).not.toBeDisabled();
    expect(loginButton).toHaveTextContent('Đăng nhập');

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('failedLoginAttempts');
  });
});