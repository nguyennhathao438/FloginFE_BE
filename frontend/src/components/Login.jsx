import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../utils/validation";
import { login as loginService } from "../services/authService";

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
      setMessage("Sai tên đăng nhập hoặc mật khẩu");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-blue-400 to-blue-100 font-[Segoe_UI]">
      <div className="w-[400px] bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center text-center">
        <h2 className="text-[#004fc4] text-[22px] font-bold mb-6">ĐĂNG NHẬP</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col items-center"
        >
          {/* --- Username input --- */}
          <input
            id="username"
            type="text"
            placeholder="Tên đăng nhập/email"
            {...register("username")}
            data-testid="username-input"
            className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg text-[15px] focus:outline-none focus:border-blue-500 transition"
          />
          {errors.username && (
            <p
              data-testid="username-error"
              className="text-red-500 text-[13px] w-full text-left -mt-1 mb-3"
            >
              {errors.username.message}
            </p>
          )}

          {/* --- Password input --- */}
          <input
            id="password"
            type="password"
            placeholder="Mật khẩu"
            {...register("password")}
            data-testid="password-input"
            className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg text-[15px] focus:outline-none focus:border-blue-500 transition"
          />
          {errors.password && (
            <p
              data-testid="password-error"
              className="text-red-500 text-[13px] w-full text-left -mt-1 mb-3"
            >
              {errors.password.message}
            </p>
          )}

          <button
            type="submit"
            data-testid="login-btn"
            className="w-full bg-[#1976f2] text-white rounded-lg py-2 text-[16px] font-semibold hover:bg-[#0f5bd4] transition"
          >
            Đăng nhập
          </button>

          <a
            href="#"
            onClick={onSwitchToRegister}
            className="mt-4 text-[#0f5bd4] text-[14px] hover:underline"
          >
            Đăng ký tài khoản
          </a>
        </form>

        {message && (
          <p
            className="mt-4 text-gray-700 font-medium"
            data-testid="message"
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
