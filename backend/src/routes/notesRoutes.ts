import express from "express";
import { createNote, deleteNote, getAllNotes, getNoteById, updateNote, noteSchema } from "../controllers/notesController.js";
import { validateBody, wrap } from "../lib/errors.js";

const router = express.Router();

router.get("/", wrap(getAllNotes));
router.get("/:id", wrap(getNoteById));
router.post("/", validateBody(noteSchema), wrap(createNote));
router.put("/:id", validateBody(noteSchema), wrap(updateNote));
router.delete("/:id", wrap(deleteNote));

export default router;
