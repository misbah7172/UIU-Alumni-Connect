import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { MentorshipService } from "../services/mentorshipService.js";
import { mentorshipRequestSchema, paginationSchema } from "../validation/schemas.js";

export const mentorshipRouter = Router();

mentorshipRouter.get("/mentors", async (req, res, next) => {
  try {
    const { page, pageSize } = paginationSchema.parse(req.query);
    const result = await MentorshipService.getMentors(page, pageSize, req.query.search as string | undefined);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

mentorshipRouter.post("/sessions", requireAuth, validateBody(mentorshipRequestSchema), async (req, res, next) => {
  try {
    const session = await MentorshipService.bookSession(req.user!.id, req.body.mentorId, new Date(req.body.meetingTime));
    res.status(201).json({ session });
  } catch (error) {
    next(error);
  }
});

mentorshipRouter.get("/sessions", requireAuth, async (req, res, next) => {
  try {
    const { page, pageSize } = paginationSchema.parse(req.query);
    const result = await MentorshipService.getUserSessions(req.user!.id, req.user!.role as "STUDENT" | "ALUMNI", page, pageSize);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

mentorshipRouter.patch("/sessions/:sessionId", requireAuth, async (req, res, next) => {
  try {
    const session = await MentorshipService.updateSessionStatus(String(req.params.sessionId), req.user!.id, req.body.status);
    res.json({ session });
  } catch (error) {
    next(error);
  }
});
