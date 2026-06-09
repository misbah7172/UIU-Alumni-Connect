import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { UserService } from "../services/userService.js";
import { updateProfileSchema, paginationSchema } from "../validation/schemas.js";

export const userRouter = Router();

userRouter.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.user!.id);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

userRouter.get("/alumni", async (req, res, next) => {
  try {
    const { page, pageSize } = paginationSchema.parse(req.query);
    const department = req.query.department as string | undefined;
    const result = await UserService.listAlumni(page, pageSize, department);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.params.userId);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

userRouter.patch("/me", requireAuth, validateBody(updateProfileSchema), async (req, res, next) => {
  try {
    const user = await UserService.updateProfile(req.user!.id, req.body);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:userId/stats", async (req, res, next) => {
  try {
    const stats = await UserService.getUserStats(req.params.userId);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});
