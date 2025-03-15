import { z } from "zod";

// Định nghĩa schema với Zod
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "User name at least 3 characters")
    .max(20, "User name less than 20 characters"),

  email: z.string().email("invalid email"),

  password: z.string().min(6, "password at least 6 characters"),

  confirmPassword: z.string().min(6, "password at least 6 characters"),
});
