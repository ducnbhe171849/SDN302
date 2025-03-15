import { z } from "zod";

export const salarySchema = z.object({
  baseSalary: z
    .string()
    .regex(/^\d+$/, "Lương cơ bản phải là số") // Kiểm tra phải là số nguyên
    .transform((val) => Number(val)) // Chuyển thành số
    .refine((val) => val >= 1000, {
      message: "Lương cơ bản phải lớn hơn hoặc bằng 1.000 VND",
    }),

  bonuses: z
    .string()
    .regex(/^\d+$/, "Thưởng phải là số")
    .transform((val) => Number(val))
    .refine((val) => val >= 0, { message: "Thưởng không thể nhỏ hơn 0" }),

  deductions: z
    .string()
    .regex(/^\d+$/, "Khấu trừ phải là số")
    .transform((val) => Number(val))
    .refine((val) => val >= 0, { message: "Khấu trừ không thể nhỏ hơn 0" }),

  totalSalary: z
    .string()
    .regex(/^\d+$/, "Tổng lương phải là số")
    .transform((val) => Number(val))
    .refine((val) => val >= 0, { message: "Tổng lương không thể nhỏ hơn 0" }),
});
