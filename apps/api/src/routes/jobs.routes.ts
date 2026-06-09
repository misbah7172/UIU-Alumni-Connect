import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { JobService } from "../services/jobService.js";
import { createJobSchema, paginationSchema } from "../validation/schemas.js";

export const jobRouter = Router();

jobRouter.get("/", async (req, res, next) => {
  try {
    const { page, pageSize } = paginationSchema.parse(req.query);
    const filters = {
      employmentType: req.query.employmentType as string,
      location: req.query.location as string,
      skills: Array.isArray(req.query.skills) ? (req.query.skills as string[]) : req.query.skills ? [req.query.skills as string] : undefined,
      search: req.query.search as string,
      referralAvailable: req.query.referralAvailable === "true"
    };
    const result = await JobService.getJobs(page, pageSize, filters);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

jobRouter.get("/:jobId", async (req, res, next) => {
  try {
    const job = await JobService.getJobById(String(req.params.jobId));
    res.json({ job });
  } catch (error) {
    next(error);
  }
});

jobRouter.post("/", requireAuth, requireRole("ALUMNI", "RECRUITER", "ADMIN"), validateBody(createJobSchema), async (req, res, next) => {
  try {
    const job = await JobService.createJob(req.user!.id, req.body);
    res.status(201).json({ job });
  } catch (error) {
    next(error);
  }
});

jobRouter.patch("/:jobId", requireAuth, validateBody(createJobSchema), async (req, res, next) => {
  try {
    const job = await JobService.updateJob(String(req.params.jobId), req.user!.id, req.body);
    res.json({ job });
  } catch (error) {
    next(error);
  }
});

jobRouter.delete("/:jobId", requireAuth, async (req, res, next) => {
  try {
    const result = await JobService.deleteJob(String(req.params.jobId), req.user!.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});
