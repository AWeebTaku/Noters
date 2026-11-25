// Creates (or resets) the public demo account used by the "Use demo account" button.
// Run: npm run seed --prefix backend
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../src/models/User.js";
import Note from "../src/models/Note.js";

dotenv.config();

const EMAIL = "demo@noters.app";
const PASSWORD = "demo-notes-2026"; // public on purpose; keep in sync with frontend LoginPage

await mongoose.connect(process.env.MONGODB_URI as string);
const user = await User.findOneAndUpdate(
  { email: EMAIL },
  { email: EMAIL, passwordHash: await bcrypt.hash(PASSWORD, 10) },
  { upsert: true, new: true }
);
await Note.deleteMany({ user: user._id });
await Note.insertMany(
  [
    ["Welcome to Noters", "This is a demo account. Notes here are shared by everyone who tries it, so do not write anything private."],
    ["Try the search", "Type in the search box on the home page to filter your notes by title or content."],
    ["Groceries", "Oats, bananas, olive oil, coffee beans, lemons."],
    ["Reading list", "Designing Data-Intensive Applications, The Pragmatic Programmer, Refactoring."],
  ].map(([title, content]) => ({ user: user._id, title, content }))
);
console.log(`Demo account ready: ${EMAIL}`);
await mongoose.disconnect();
