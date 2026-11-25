import express, { type RequestHandler } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import notesRoutes from "./routes/notesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { requireAuth } from "./middleware/requireAuth.js";
import { errorHandler } from "./lib/errors.js";

// Limiters are passed in so tests can run without Redis.
export function createApp(limiters: { api: RequestHandler; auth: RequestHandler }) {
  const app = express();
  app.set("trust proxy", 1); // Render sits behind one proxy; needed for the real client IP

  if (process.env.NODE_ENV !== "production") {
    app.use(cors({ origin: "http://localhost:5173", credentials: true }));
  }
  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser());
  app.use("/api", limiters.api);

  app.use("/api/auth/login", limiters.auth);
  app.use("/api/auth/register", limiters.auth);
  app.use("/api/auth", authRoutes);
  app.use("/api/notes", requireAuth, notesRoutes);

  if (process.env.NODE_ENV === "production") {
    const dist = path.resolve("../frontend/dist");
    app.use(express.static(dist));
    app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
  }

  app.use(errorHandler);
  return app;
}
