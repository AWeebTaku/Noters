import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError, type ZodType } from "zod";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

// Express 4 does not catch rejected promises, so wrap async handlers.
export const wrap =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Validates and replaces req.body / req.query (query is stored on res.locals).
export const validateBody =
  <T>(schema: ZodType<T>): RequestHandler =>
  (req, _res, next) => {
    req.body = schema.parse(req.body);
    next();
  };

// All errors leave the API in one shape: { message, errors? }
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      errors: err.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
    });
    return;
  }
  if (err instanceof HttpError) {
    res.status(err.status).json({ message: err.message });
    return;
  }
  if (err?.type === "entity.parse.failed") {
    res.status(400).json({ message: "Invalid JSON" });
    return;
  }
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
};
