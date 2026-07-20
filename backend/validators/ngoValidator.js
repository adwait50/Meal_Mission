const { z } = require("zod");

const ngoRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Invalid phone number").max(10, "Invalid phone number"),
  address: z.string().min(3, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
});

const ngoLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const ngoForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const ngoResetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "Invalid OTP"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

module.exports = { ngoRegisterSchema, ngoLoginSchema, ngoForgotPasswordSchema, ngoResetPasswordSchema };