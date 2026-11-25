import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "../lib/errors.js";

export const COOKIE = "token";

declare module "express-serve-static-core" {
  interface Request {
    userId: string;
  }
}

export const requireAuth: RequestHandler = (req, _res, next) => {
  const token = req.cookies?.[COOKIE];
  if (!token) throw new HttpError(401, "Not logged in");
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { sub: string };
    req.userId = payload.sub;
    next();
  } catch {
    throw new HttpError(401, "Session expired, please log in again");
  }
};
