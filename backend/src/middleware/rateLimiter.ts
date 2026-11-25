import type { RequestHandler } from "express";
import type { Ratelimit } from "@upstash/ratelimit";

// Limits per client IP (app sets "trust proxy" so this is the real client behind Render).
export const rateLimiter =
  (limiter: Pick<Ratelimit, "limit">): RequestHandler =>
  async (req, res, next) => {
    try {
      const { success } = await limiter.limit(req.ip ?? "unknown");
      if (!success) {
        res.status(429).json({ message: "Too many requests, please try again later" });
        return;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
