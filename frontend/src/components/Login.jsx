import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../utils/validation";
import { login as loginService } from "../services/authService";
import "./css/Login.css"; // 👈 thêm dòng này
import { useNavigate } from "react-router";
import { useAuthStore } from "../storage/useAuthStorage";
export default function Login({ onSwitchToRegister }) {
  const { login } = useAuthStore();
  const [message, setMessage] = useState("");
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

  const onSubmit = async (data) => {
    try {
      const res = await loginService(data);
      setMessage(res.message || "Đăng nhập thành công!");
      login(res.username, res.token);
      nav("/dashboard");
      reset();
    } catch (err) {
      setMessage("Sai tên đăng nhập hoặc mật khẩu");
    }
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
          />
          {errors.password && (
            <p data-testid="password-error" className="login-error">
              {errors.password.message}
            </p>
          )}

          <button type="submit" data-testid="login-btn" className="login-btn">
            Đăng nhập
          </button>

          <a href="#" onClick={onSwitchToRegister} className="register-link">
            Đăng ký tài khoản
          </a>
        </form>

        {message && (
          <p className="login-message" data-testid="message">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
