import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import next from "next";
import { createApp } from "../apps/api/dist/app.js";
import { apiPort } from "../apps/api/dist/config/env.js";

const currentDir = dirname(fileURLToPath(import.meta.url));
const rootDir = join(currentDir, "..");
const webDir = join(rootDir, "apps", "web");
const port = Number(process.env.PORT || apiPort || 4000);

const nextApp = next({
  dev: false,
  dir: webDir
});

const handle = nextApp.getRequestHandler();

await nextApp.prepare();

const app = createApp();

app.all("*", (req, res) => {
  return handle(req, res);
});

app.listen(port, "0.0.0.0", () => {
  console.log(`UIU Alumni Connect is running on port ${port}`);
});
