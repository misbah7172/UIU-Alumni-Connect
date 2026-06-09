import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const here = dirname(fileURLToPath(import.meta.url));
const apiRoot = resolve(here, "../..");
const repoRoot = resolve(apiRoot, "../..");

const candidates = [
  resolve(process.cwd(), ".env.local"),
  resolve(process.cwd(), ".env"),
  resolve(process.cwd(), "apps/api/.env.local"),
  resolve(process.cwd(), "apps/api/.env"),
  resolve(apiRoot, ".env.local"),
  resolve(apiRoot, ".env"),
  resolve(repoRoot, ".env.local"),
  resolve(repoRoot, ".env")
];

for (const path of candidates) {
  if (existsSync(path)) {
    dotenv.config({ path, override: false });
  }
}
