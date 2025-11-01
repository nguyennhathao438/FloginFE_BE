import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Tên đăng nhập/email phải có ít nhất 3 ký tự")
    .max(10, "Tên đăng nhập/email quá dài"),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(10, "Mật khẩu quá dài"),
});
// ✅
export const registerSchema = z
  .object({
    username: z.string()
      .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
      .max(10, "Tên đăng nhập tối đa 30 ký tự"),
    password: z.string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });
