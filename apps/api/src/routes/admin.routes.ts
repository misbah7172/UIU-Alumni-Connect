import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { AdminService } from "../services/notificationService.js";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("ADMIN"));

adminRouter.get("/analytics", async (_req, res, next) => {
  try {
    const analytics = await AdminService.getAnalytics();
    res.json(analytics);
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/reports", async (req, res, next) => {
  try {
    res.json({ data: [], message: "Moderation reports endpoint." });
  } catch (error) {
    next(error);
  }
});

adminRouter.patch("/users/:userId/verify", async (req, res, next) => {
  try {
    const user = await AdminService.verifyUser(req.params.userId);
    res.json({ user, message: "User verified successfully" });
  } catch (error) {
    next(error);
  }
});
