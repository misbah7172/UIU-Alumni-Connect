import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { NotificationService } from "../services/notificationService.js";
import { paginationSchema } from "../validation/schemas.js";

export const notificationRouter = Router();

notificationRouter.get("/", requireAuth, async (req, res, next) => {
  try {
    const { page, pageSize } = paginationSchema.parse(req.query);
    const unreadOnly = req.query.unread === "true";
    const result = await NotificationService.getUserNotifications(req.user!.id, page, pageSize, unreadOnly);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

notificationRouter.patch("/read-all", requireAuth, async (req, res, next) => {
  try {
    const result = await NotificationService.markAllAsRead(req.user!.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

notificationRouter.patch("/:notificationId/read", requireAuth, async (req, res, next) => {
  try {
    const notification = await NotificationService.markAsRead(String(req.params.notificationId), req.user!.id);
    res.json({ notification });
  } catch (error) {
    next(error);
  }
});

notificationRouter.delete("/:notificationId", requireAuth, async (req, res, next) => {
  try {
    const result = await NotificationService.deleteNotification(String(req.params.notificationId), req.user!.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});
