import type { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import Note from "../models/Note.js";
import { HttpError } from "../lib/errors.js";

export const noteSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  content: z.string().trim().min(1, "Content is required").max(20000),
});

const listSchema = z.object({
  search: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Every query below filters by `user: req.userId`. That filter is what keeps notes private.
// A note that belongs to someone else is reported as 404, same as a missing one.
function ownedId(req: Request) {
  const id = req.params.id as string;
  if (!isValidObjectId(id)) throw new HttpError(404, "Note not found");
  return id;
}

export async function getAllNotes(req: Request, res: Response) {
  const { search, page, limit } = listSchema.parse(req.query);
  const filter: Record<string, unknown> = { user: req.userId };
  if (search) {
    // ponytail: regex scan per user; switch to a Mongo text index if users get thousands of notes
    const rx = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ title: rx }, { content: rx }];
  }
  const [notes, total] = await Promise.all([
    Note.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Note.countDocuments(filter),
  ]);
  res.json({ notes, page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) });
}

export async function getNoteById(req: Request, res: Response) {
  const note = await Note.findOne({ _id: ownedId(req), user: req.userId });
  if (!note) throw new HttpError(404, "Note not found");
  res.json(note);
}

export async function createNote(req: Request, res: Response) {
  const note = await Note.create({ ...req.body, user: req.userId });
  res.status(201).json(note);
}

export async function updateNote(req: Request, res: Response) {
  const note = await Note.findOneAndUpdate(
    { _id: ownedId(req), user: req.userId },
    { title: req.body.title, content: req.body.content },
    { new: true }
  );
  if (!note) throw new HttpError(404, "Note not found");
  res.json(note);
}

export async function deleteNote(req: Request, res: Response) {
  const note = await Note.findOneAndDelete({ _id: ownedId(req), user: req.userId });
  if (!note) throw new HttpError(404, "Note not found");
  res.json({ message: "Note deleted successfully" });
}
