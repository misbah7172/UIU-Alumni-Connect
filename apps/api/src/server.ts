import { createApp } from "./app.js";
import { apiPort } from "./config/env.js";

const app = createApp();

app.listen(apiPort, () => {
  console.log(`UIU Alumni Connect API listening on port ${apiPort}`);
});
