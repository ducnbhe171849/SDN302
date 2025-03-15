import { z } from "zod";

export const UpdateEmployeeSchema = z.object({
  fullName: z.string().min(1, "Họ tên không được để trống").optional(),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày sinh không hợp lệ")
    .optional(),
  gender: z.enum(["Male", "Female"]).optional(),
  address: z.string().min(1, "Địa chỉ không được để trống").optional(),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, "Số điện thoại phải có 10 chữ số")
    .optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày bắt đầu làm việc không hợp lệ")
    .optional(),
  avatar: z.string().url("Avatar phải là URL hợp lệ").optional(),
});
