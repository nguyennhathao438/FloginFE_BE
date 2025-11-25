import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// // import { registerSchema } from "../utils/validation";
// import { register as registerService } from "../services/authService";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-400 to-blue-100">
      <div className="bg-white w-[400px] rounded-xl shadow-lg p-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          ĐĂNG KÝ TÀI KHOẢN
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col items-center"
        >
          {/* Username */}
          <input
            id="username"
            type="text"
            placeholder="Tên đăng nhập/email"
            {...register("username")}
            className={`w-full px-4 py-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              errors.username ? "border-red-500" : "border-gray-300"
            }`}
            data-testid="username-input"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mb-2 text-left w-full">
              {errors.username.message}
            </p>
          )}

          {/* Password */}
          <input
            id="password"
            type="password"
            placeholder="Mật khẩu"
            {...register("password")}
            className={`w-full px-4 py-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            data-testid="password-input"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mb-2 text-left w-full">
              {errors.password.message}
            </p>
          )}

          {/* Confirm Password */}
          <input
            id="confirmPassword"
            type="password"
            placeholder="Xác nhận mật khẩu"
            {...register("confirmPassword")}
            className={`w-full px-4 py-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
            data-testid="confirmPassword-input"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mb-2 text-left w-full">
              {errors.confirmPassword.message}
            </p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Đăng ký
          </button>

          {/* Switch to Login */}
          <a
            href="#"
            onClick={onSwitchToLogin}
            className="text-blue-600 text-sm mt-4 hover:underline"
          >
            Đăng nhập
          </a>
        </form>

        {message && (
          <p
            className="mt-4 text-sm text-gray-700 font-medium"
            data-testid="message"
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
