import z from "zod";

// Định nghĩa schema
export const changePasswordSchema = z
  .object({
    newPassword: z.string().min(5, "Mật khẩu mới phải có ít nhất 5 ký tự"), // Mật khẩu mới ít nhất 6 ký tự
    confirmPassword: z
      .string()
      .min(5, "Xác nhận mật khẩu phải có ít nhất 5 ký tự"), // Xác nhận mật khẩu ít nhất 6 ký tự
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu mới và xác nhận mật khẩu không khớp", // Kiểm tra mật khẩu mới và xác nhận mật khẩu khớp nhau
    path: ["confirmPassword"], // Đường dẫn lỗi sẽ trỏ đến confirmPassword
  });
