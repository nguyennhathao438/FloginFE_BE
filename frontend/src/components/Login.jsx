import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../utils/validation";
import { login as loginService } from "../services/authService";
import "./css/Login.css";
import { useNavigate } from "react-router";
import { useAuthStore } from "../storage/useAuthStorage";

export default function Login({ onSwitchToRegister }) {
  const { login } = useAuthStore();
  const [message, setMessage] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockUntil, setLockUntil] = useState(null);
  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  // Khôi phục trạng thái khóa từ localStorage khi component mount
  useEffect(() => {
    const savedLockUntil = localStorage.getItem("loginLockUntil");
    const savedFailedAttempts = localStorage.getItem("failedLoginAttempts");

    if (savedLockUntil) {
      const lockTime = parseInt(savedLockUntil);
      if (Date.now() < lockTime) {
        setIsLocked(true);
        setLockUntil(lockTime);
      } else {
        // Hết thời gian khóa, reset
        localStorage.removeItem("loginLockUntil");
        localStorage.removeItem("failedLoginAttempts");
      }
    }

    if (savedFailedAttempts) {
      setFailedAttempts(parseInt(savedFailedAttempts));
    }
  }, []);

  // Cập nhật đếm thời gian khóa
  useEffect(() => {
    if (!isLocked || !lockUntil) return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now >= lockUntil) {
        setIsLocked(false);
        setLockUntil(null);
        setFailedAttempts(0);
        localStorage.removeItem("loginLockUntil");
        localStorage.removeItem("failedLoginAttempts");
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLocked, lockUntil]);

  const onSubmit = async (data) => {
    // Kiểm tra nếu tài khoản đang bị khóa
    if (isLocked) {
      const remainingTime = Math.ceil((lockUntil - Date.now()) / 1000 / 60);
      setMessage(`Tài khoản tạm thời bị khóa. Vui lòng thử lại sau ${remainingTime} phút.`);
      return;
    }

    try {
      const res = await loginService(data);
      
      // Đăng nhập thành công, reset số lần thất bại
      setFailedAttempts(0);
      localStorage.removeItem("failedLoginAttempts");
      localStorage.removeItem("loginLockUntil");
      
      setMessage(res.message || "Đăng nhập thành công!");
      localStorage.setItem("token", res.token);
      login(res.username, res.token);
      nav("/dashboard");
      reset();
    } catch (err) {
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);
      localStorage.setItem("failedLoginAttempts", newFailedAttempts.toString());

      if (newFailedAttempts >= 5) {
        // Khóa tài khoản trong 5 phút
        const lockTime = Date.now() + 5 * 60 * 1000; // 5 phút
        setIsLocked(true);
        setLockUntil(lockTime);
        localStorage.setItem("loginLockUntil", lockTime.toString());
        
        setMessage("Bạn đã đăng nhập sai quá 5 lần. Tài khoản bị khóa trong 5 phút.");
      } else {
        setMessage(`Sai tên đăng nhập hoặc mật khẩu. Bạn còn ${5 - newFailedAttempts} lần thử.`);
      }
    }
  };

  // Hiển thị thời gian còn lại nếu bị khóa
  const getRemainingTime = () => {
    if (!isLocked || !lockUntil) return 0;
    return Math.ceil((lockUntil - Date.now()) / 1000 / 60);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">ĐĂNG NHẬP</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          {/* Username */}
          <input
            id="username"
            type="text"
            placeholder="Tên đăng nhập/email"
            {...register("username")}
            data-testid="username-input"
            className="login-input"
            disabled={isLocked}
          />
          {errors.username && (
            <p data-testid="username-error" className="login-error">
              {errors.username.message}
            </p>
          )}

          {/* Password */}
          <input
            id="password"
            type="password"
            placeholder="Mật khẩu"
            {...register("password")}
            data-testid="password-input"
            className="login-input"
            disabled={isLocked}
          />
          {errors.password && (
            <p data-testid="password-error" className="login-error">
              {errors.password.message}
            </p>
          )}

          <button 
            type="submit" 
            data-testid="login-btn" 
            className="login-btn"
            disabled={isLocked}
          >
            {isLocked ? `Bị khóa (${getRemainingTime()} phút)` : "Đăng nhập"}
          </button>

          <a href="#" onClick={onSwitchToRegister} className="register-link">
            Đăng ký tài khoản
          </a>
        </form>

        {message && (
          <p className={`login-message ${isLocked ? 'login-message-error' : ''}`} data-testid="message">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}