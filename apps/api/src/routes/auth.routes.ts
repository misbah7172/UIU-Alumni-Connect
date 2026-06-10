import { Router } from "express";
import { z } from "zod";
import { AuthService } from "../services/authService.js";

export const authRouter = Router();

const firebaseLoginSchema = z.object({
  idToken: z.string().min(1)
});

authRouter.post("/firebase/google", async (req, res, next) => {
  try {
    const body = firebaseLoginSchema.parse(req.body);
    const result = await AuthService.loginWithFirebase(body.idToken);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", (_req, res) => {
  res.status(410).json({ message: "Manual login is disabled. Use Google authentication." });
});

authRouter.post("/register", (_req, res) => {
  res.status(410).json({ message: "Manual registration is disabled. Use Google authentication." });
});

authRouter.post("/reset-password", (_req, res) => {
  res.status(410).json({ message: "Password reset is disabled because authentication is handled by Google." });
});
