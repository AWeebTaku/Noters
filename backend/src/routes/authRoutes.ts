import express from "express";
import { credentialsSchema, login, logout, me, register } from "../controllers/authController.js";
import { validateBody, wrap } from "../lib/errors.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.post("/register", validateBody(credentialsSchema), wrap(register));
router.post("/login", validateBody(credentialsSchema), wrap(login));
router.post("/logout", logout);
router.get("/me", requireAuth, wrap(me));

export default router;
