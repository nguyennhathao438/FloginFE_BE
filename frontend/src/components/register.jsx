import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../utils/validation";
import { register as registerService } from "../services/authService";
import "./Login.css";

export default function Register({ onSwitchToLogin }) {
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      const res = await registerService(data);
      setMessage(res.message || "Đăng ký thành công!");
      reset();
      if (onSwitchToLogin) onSwitchToLogin();
    } catch (err) {
      setMessage(err.message || "Đăng ký thất bại! Vui lòng thử lại.");
    }
  };

  return (
    <div className="login-container">
      <h2>ĐĂNG KÝ TÀI KHOẢN</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          id="username"
          type="text"
          placeholder="Tên đăng nhập/email"
          {...register("username")}
          className={`login-input ${errors.username ? "input-error" : ""}`}
          data-testid="username-input"
        />
        {errors.username && <p className="error">{errors.username.message}</p>}

        <input
          id="password"
          type="password"
          placeholder="Mật khẩu"
          {...register("password")}
          className={`login-input ${errors.password ? "input-error" : ""}`}
          data-testid="password-input"
        />
        {errors.password && <p className="error">{errors.password.message}</p>}

        <input
          id="confirmPassword"
          type="password"
          placeholder="Xác nhận mật khẩu"
          {...register("confirmPassword")}
          className={`login-input ${errors.confirmPassword ? "input-error" : ""}`}
          data-testid="confirmPassword-input"
        />
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword.message}</p>
        )}

        <button type="submit" className="login-button">
          Đăng ký
        </button>

        <a
          href="#"
          type="button"
          className="register-link"
          onClick={onSwitchToLogin}
        >
          Đăng nhập
        </a>
      </form>

      {message && (
        <p className="login-message" data-testid="message">
          {message}
        </p>
      )}
    </div>
  );
}
