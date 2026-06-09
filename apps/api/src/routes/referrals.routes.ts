import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { ReferralService } from "../services/referralService.js";
import { referralRequestSchema, paginationSchema } from "../validation/schemas.js";

export const referralRouter = Router();

referralRouter.post("/", requireAuth, validateBody(referralRequestSchema), async (req, res, next) => {
  try {
    const referral = await ReferralService.requestReferral(req.user!.id, req.body.alumniId, req.body.jobId, req.body.message);
    res.status(201).json({ referral });
  } catch (error) {
    next(error);
  }
});

referralRouter.get("/sent", requireAuth, async (req, res, next) => {
  try {
    const { page, pageSize } = paginationSchema.parse(req.query);
    const result = await ReferralService.getReferralsSent(req.user!.id, page, pageSize);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

referralRouter.get("/received", requireAuth, requireRole("ALUMNI", "RECRUITER"), async (req, res, next) => {
  try {
    const { page, pageSize } = paginationSchema.parse(req.query);
    const status = req.query.status as string | undefined;
    const result = await ReferralService.getReferralsReceived(req.user!.id, page, pageSize, status);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

referralRouter.patch("/:referralId", requireAuth, async (req, res, next) => {
  try {
    const status = req.body.status as "ACCEPTED" | "REJECTED";
    const referral = await ReferralService.updateReferralStatus(String(req.params.referralId), req.user!.id, status);
    res.json({ referral });
  } catch (error) {
    next(error);
  }
});
