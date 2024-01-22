import * as z from "zod";

const email = z
  .string({
    invalid_type_error: "Email is required",
    required_error: "Email is required",
  })
  .email({
    message: "Email is required",
  });
const password = z
  .string({
    invalid_type_error: "Password is required",
    required_error: "Password is required",
  })
  .min(1, {
    message: "Password is required",
  })

export const LoginSchema = z.object({
  email,
  password,
});

export const RegisterSchema = z
  .object({
    email,
    password,
    confirmPassword: z.string().min(1, {
      message: "Confirm password is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
