import { z } from "zod";

// --- Hàm validation thuần (dùng cho Unit test TDD) ---
const validation = {
  validateUsername(username) {
    if (!username || username.trim() === "") {
      return "Username không được để trống";
    }
    if (username.length < 6) {
      return "Username phải có ít nhất 6 ký tự";
    }
    if (username.length > 20) {
      return "Username không được vượt quá 20 ký tự";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return "Username chỉ được chứa chữ, số và dấu gạch dưới";
    }
    return "";
  },

  validatePassword(password) {
    if (!password || password.trim() === "") {
      return "Password không được để trống";
    }
    if (password.length < 6) {
      return "Password phải có ít nhất 6 ký tự";
    }
    if (password.length > 20) {
      return "Password không được vượt quá 20 ký tự";
    }
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return "Password phải chứa cả chữ và số";
    }
    return "";
  },
};

// --- Zod schema cho react-hook-form ---
export const loginSchema = z.object({
  username: z
    .string({ required_error: "Username không được để trống" })
    .min(6, "Username phải có ít nhất 6 ký tự")
    .max(20, "Username không được vượt quá 20 ký tự")
    .regex(/^[a-zA-Z0-9_]+$/, "Username chỉ được chứa chữ, số và dấu gạch dưới"),
  password: z
    .string({ required_error: "Password không được để trống" })
    .min(6, "Password phải có ít nhất 6 ký tự")
    .max(20, "Password không được vượt quá 20 ký tự")
    .refine(
      (val) => /[A-Za-z]/.test(val) && /[0-9]/.test(val),
      "Password phải chứa cả chữ và số"
    ),
});

export default validation;


// // --- Schema cho Đăng ký ---
// export const registerSchema = z
//   .object({
//     username: z
//       .string()
//       .min(6, "Tên đăng nhập phải có ít nhất 6 ký tự")
//       .max(30, "Tên đăng nhập quá dài")
//       .refine((val) => !/\s/.test(val), {
//         message: "Tên đăng nhập không được chứa khoảng trắng",
//       }),
//     password: z
//       .string()
//       .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
//       .max(30, "Mật khẩu quá dài")
//       .refine((val) => !/\s/.test(val), {
//         message: "Mật khẩu không được chứa khoảng trắng",
//       }),
//     confirmPassword: z.string(),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Mật khẩu xác nhận không khớp",
//     path: ["confirmPassword"],
//   });
