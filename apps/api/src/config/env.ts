import "./load-env.js";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().optional(),
  API_PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  FIREBASE_PROJECT_ID: z.string().min(1),
  FIREBASE_CLIENT_EMAIL: z.string().email(),
  FIREBASE_PRIVATE_KEY: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  WEB_ORIGIN: z.string().url().default("http://localhost:3000")
});

export const env = envSchema.parse(process.env);

export const apiPort = env.PORT ?? env.API_PORT;
