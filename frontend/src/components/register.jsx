import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../utils/validation";
import axios from "axios";
import "./Login.css"; 

export default function Register({ onSwitchToLogin }) {
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
      const res = await axios.post("http://localhost:3700/api/users/register", data);
      alert("Đăng ký thành công!");
      console.log(res.data);
      reset();
      if (onSwitchToLogin) onSwitchToLogin();
    } catch (err) {
      console.error("Register error:", err);
      alert("Đăng ký thất bại! Vui lòng thử lại.");
    }
  };

  return (
    <div className="login-container">
      <h2>ĐĂNG KÝ TÀI KHOẢN</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Tên đăng nhập/email"
          {...register("username")}
          className={`login-input ${errors.username ? "input-error" : ""}`}
        />
        {errors.username && <p className="error">{errors.username.message}</p>}

        <input
          type="password"
          placeholder="Mật khẩu"
          {...register("password")}
          className={`login-input ${errors.password ? "input-error" : ""}`}
        />
        {errors.password && <p className="error">{errors.password.message}</p>}

        <input
          type="password"
          placeholder="Xác nhận mật khẩu"
          {...register("confirmPassword")}
          className={`login-input ${errors.confirmPassword ? "input-error" : ""}`}
        />
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword.message}</p>
        )}

        <button type="submit" className="login-button">
          Đăng ký
        </button>

        <a href="#" className="register-link" onClick={onSwitchToLogin}>
          Đăng nhập
        </a>
      </form>
    </div>
  );
}
