import dotenv from "dotenv";
dotenv.config();

import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
import { apiLimit, authLimit } from "./config/upstash.js";
import { rateLimiter } from "./middleware/rateLimiter.js";

const PORT = process.env.PORT || 5001;

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing. Add a long random string to backend/.env");
  process.exit(1);
}

const app = createApp({ api: rateLimiter(apiLimit), auth: rateLimiter(authLimit) });

connectDB().then(() => {
  app.listen(PORT, () => console.log("Server started on PORT:", PORT));
});
