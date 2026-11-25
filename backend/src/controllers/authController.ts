import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/User.js";
import { HttpError } from "../lib/errors.js";
import { COOKIE } from "../middleware/requireAuth.js";

export const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email")),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

const WEEK = 7 * 24 * 60 * 60 * 1000;

function startSession(res: Response, userId: string) {
  const token = jwt.sign({ sub: userId }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
  res.cookie(COOKIE, token, {
    httpOnly: true, // page scripts cannot read it
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: WEEK,
  });
}

const publicUser = (u: { _id: unknown; email: string }) => ({ id: String(u._id), email: u.email });

export async function register(req: Request, res: Response) {
  const { email, password } = req.body;
  if (await User.exists({ email })) throw new HttpError(409, "That email is already registered");
  const user = await User.create({ email, passwordHash: await bcrypt.hash(password, 10) });
  startSession(res, String(user._id));
  res.status(201).json(publicUser(user));
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  // same message for unknown email and wrong password, so emails cannot be probed
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new HttpError(401, "Wrong email or password");
  }
  startSession(res, String(user._id));
  res.json(publicUser(user));
}

export function logout(_req: Request, res: Response) {
  res.clearCookie(COOKIE);
  res.json({ message: "Logged out" });
}

export async function me(req: Request, res: Response) {
  const user = await User.findById(req.userId);
  if (!user) throw new HttpError(401, "Account no longer exists");
  res.json(publicUser(user));
}
