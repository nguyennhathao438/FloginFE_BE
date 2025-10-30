// src/components/Login.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../utils/validation";
import { login as loginService } from "../services/authService";
import "./Login.css";

export default function Login({ onSwitchToRegister }) {
  const [message, setMessage] = useState("");

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
      reset();
    } catch (err) {
      setMessage(err?.response?.data?.message || "Tên đăng nhập hoặc mật khẩu không đúng!");
    }
  };

  return (
    <div className="login-container">
      <h2>ĐĂNG NHẬP</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          id="username"
          type="text"
          placeholder="Tên đăng nhập/email"
          {...register("username")}
          className="login-input"
          data-testid="username-input"
        />
        {errors.username && <p className="error">{errors.username.message}</p>}

        <input
          id="password"
          type="password"
          placeholder="Mật khẩu"
          {...register("password")}
          className="login-input"
          data-testid="password-input"
        />
        {errors.password && <p className="error">{errors.password.message}</p>}

        <button type="submit" className="login-button">
          Đăng nhập
        </button>

        <a
          href="#"
          type="button"
          className="register-link"
          onClick={onSwitchToRegister}
        >
          Đăng ký tài khoản
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
