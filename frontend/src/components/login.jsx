import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../utils/validation";
import axios from "axios";
import "./Login.css";

export default function Login({ onSwitchToRegister }) {
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
      const res = await axios.post("http://localhost:3700/api/users/login", data);
      alert("Đăng nhập thành công!");
      console.log(res.data);
       reset();
    }catch (err) {
        console.error("Login error:", err);
        alert("Tên đăng nhập hoặc mật khẩu không đúng!");
    }

};

  return (
    <div className="login-container">
      <h2>ĐĂNG NHẬP</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Tên đăng nhập/email"
          {...register("username")}
          className="login-input"
        />
        {errors.username && (
          <p className="error">{errors.username.message}</p>
        )}

        <input
          type="password"
          placeholder="Mật khẩu"
          {...register("password")}
          className="login-input"
        />
        {errors.password && (
          <p className="error">{errors.password.message}</p>
        )}

        <button type="submit" className="login-button">
          Đăng nhập
        </button>

        <a href="#" className="register-link" onClick={onSwitchToRegister}>
          Đăng ký tài khoản
        </a>
      </form>
    </div>
  );
}
