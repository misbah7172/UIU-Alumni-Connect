import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";
import { errorHandler } from "./middleware/error-handler.js";
import { apiRouter } from "./routes/index.js";

export function createApp() {
  const app = express();

  app.use(
    helmet({
      contentSecurityPolicy: false
    })
  );
  app.use(cors({ origin: env.WEB_ORIGIN, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));
  app.use(
    rateLimit({
      windowMs: 60_000,
      limit: 120,
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "uiu-alumni-api" });
  });

  app.get("/health/db", async (_req, res, next) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ status: "ok", database: "connected" });
    } catch (error) {
      next(error);
    }
  });

  app.use("/api", apiRouter);
  app.use(errorHandler);

  return app;
}
