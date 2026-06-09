import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { userRouter } from "./users.routes.js";
import { jobRouter } from "./jobs.routes.js";
import { questionRouter } from "./questions.routes.js";
import { referralRouter } from "./referrals.routes.js";
import { mentorshipRouter } from "./mentorship.routes.js";
import { notificationRouter } from "./notifications.routes.js";
import { adminRouter } from "./admin.routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/jobs", jobRouter);
apiRouter.use("/questions", questionRouter);
apiRouter.use("/referrals", referralRouter);
apiRouter.use("/mentorship", mentorshipRouter);
apiRouter.use("/notifications", notificationRouter);
apiRouter.use("/admin", adminRouter);
