import { z } from "zod";

// Hàm kiểm tra đủ 18 tuổi
const isAdult = (dateString) => {
  const dob = new Date(dateString);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();

  const isBirthdayPassed =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

  // return age > 18 || (age === 18 && isBirthdayPassed);
  return true;
};

// Schema Zod
export const EmployeeSchema = z.object({
  fullName: z.string().min(1, "Họ và tên không được để trống"),
  dateOfBirth: z.string().refine(isAdult, {
    message: "Nhân viên phải đủ 18 tuổi trở lên",
  }),
  gender: z.enum(["Male", "Females"], {
    message: "Giới tính phải là 'Nam' hoặc 'Nữ'",
  }),
  address: z.string().min(1, "Địa chỉ không được để trống"),
  phoneNumber: z
    .string()
    .regex(/^0\d{9}$/, "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0"),
  department: z.string(),
  position: z.string().min(1, "Chức vụ không được để trống"),
  salary: z
    .string()
    .regex(/^\d+$/, "Lương phải là số nguyên dương")
    .transform((val) => parseInt(val, 10)), // Chuyển về số nguyên
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Ngày bắt đầu phải là ngày hợp lệ",
  }),
  avatar: z.string().optional(),
  email: z.string().email(),
});
