import { Router } from "express";
import { z } from "zod";
import { AuthService } from "../services/authService.js";
import { HttpError } from "../utils/http-error.js";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email("Invalid email format")
});

const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["STUDENT", "ALUMNI", "RECRUITER"]).default("STUDENT"),
  department: z.string().optional(),
  batch: z.string().optional()
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);
    const result = await AuthService.login(body.email);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/register", async (req, res, next) => {
  try {
    const body = registerSchema.parse(req.body);
    const result = await AuthService.register(body.email, "", body.name, body.role, body.department, body.batch);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/reset-password", async (req, res, next) => {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);
    res.json({
      message: "If this email exists in our system, a password reset link has been sent.",
      email
    });
  } catch (error) {
    next(error);
  }
});
