import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createApp } from "../src/app.js";

const pass = (_req: unknown, _res: unknown, next: () => void) => next();
const app = createApp({ api: pass as never, auth: pass as never });

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});
afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});
beforeEach(async () => {
  await mongoose.connection.dropDatabase();
});

// returns an agent that keeps the login cookie
async function signUp(email: string, password = "password123") {
  const agent = request.agent(app);
  const res = await agent.post("/api/auth/register").send({ email, password });
  expect(res.status).toBe(201);
  return agent;
}

describe("auth", () => {
  it("registers, sets an httpOnly cookie and returns the user", async () => {
    const res = await request(app).post("/api/auth/register").send({ email: "A@Test.com", password: "password123" });
    expect(res.status).toBe(201);
    expect(res.body.email).toBe("a@test.com");
    expect(res.body.passwordHash).toBeUndefined();
    expect(res.headers["set-cookie"]![0]).toMatch(/HttpOnly/i);
  });

  it("rejects duplicate emails, short passwords and bad emails", async () => {
    await signUp("a@test.com");
    expect((await request(app).post("/api/auth/register").send({ email: "a@test.com", password: "password123" })).status).toBe(409);
    const short = await request(app).post("/api/auth/register").send({ email: "b@test.com", password: "short" });
    expect(short.status).toBe(400);
    expect(short.body.errors[0].field).toBe("password");
    expect((await request(app).post("/api/auth/register").send({ email: "nope", password: "password123" })).status).toBe(400);
  });

  it("logs in with the right password only", async () => {
    await signUp("a@test.com");
    expect((await request(app).post("/api/auth/login").send({ email: "a@test.com", password: "wrong-password" })).status).toBe(401);
    expect((await request(app).post("/api/auth/login").send({ email: "a@test.com", password: "password123" })).status).toBe(200);
  });

  it("/me needs a session, and logout ends it", async () => {
    expect((await request(app).get("/api/auth/me")).status).toBe(401);
    const agent = await signUp("a@test.com");
    expect((await agent.get("/api/auth/me")).body.email).toBe("a@test.com");
    await agent.post("/api/auth/logout");
    expect((await agent.get("/api/auth/me")).status).toBe(401);
  });
});

describe("notes", () => {
  it("requires login", async () => {
    expect((await request(app).get("/api/notes")).status).toBe(401);
  });

  it("creates, reads, updates and deletes a note", async () => {
    const a = await signUp("a@test.com");
    const created = await a.post("/api/notes").send({ title: "Hello", content: "World" });
    expect(created.status).toBe(201);
    const id = created.body._id;

    expect((await a.get(`/api/notes/${id}`)).body.title).toBe("Hello");
    expect((await a.put(`/api/notes/${id}`).send({ title: "New", content: "Text" })).body.title).toBe("New");
    expect((await a.delete(`/api/notes/${id}`)).status).toBe(200);
    expect((await a.get(`/api/notes/${id}`)).status).toBe(404);
  });

  it("user A cannot read, edit, delete or list user B's note", async () => {
    const a = await signUp("a@test.com");
    const b = await signUp("b@test.com");
    const id = (await b.post("/api/notes").send({ title: "Secret", content: "B only" })).body._id;

    expect((await a.get(`/api/notes/${id}`)).status).toBe(404);
    expect((await a.put(`/api/notes/${id}`).send({ title: "Hacked", content: "x" })).status).toBe(404);
    expect((await a.delete(`/api/notes/${id}`)).status).toBe(404);
    expect((await a.get("/api/notes")).body.total).toBe(0);

    // B's note is untouched
    const still = await b.get(`/api/notes/${id}`);
    expect(still.body.title).toBe("Secret");
  });

  it("validates input and bad ids", async () => {
    const a = await signUp("a@test.com");
    const bad = await a.post("/api/notes").send({ title: "   ", content: "" });
    expect(bad.status).toBe(400);
    expect(bad.body.message).toBe("Validation failed");
    expect((await a.get("/api/notes/not-an-id")).status).toBe(404);
  });

  it("paginates and searches", async () => {
    const a = await signUp("a@test.com");
    for (let i = 1; i <= 5; i++) await a.post("/api/notes").send({ title: `Note ${i}`, content: i === 3 ? "needle (1+1)" : "hay" });

    const page2 = (await a.get("/api/notes?limit=2&page=2")).body;
    expect(page2.notes).toHaveLength(2);
    expect(page2).toMatchObject({ total: 5, totalPages: 3, page: 2 });

    const found = (await a.get("/api/notes?search=NEEDLE")).body;
    expect(found.total).toBe(1);
    // regex characters in the search are treated as plain text
    expect((await a.get("/api/notes?search=" + encodeURIComponent("(1+1)"))).body.total).toBe(1);
    expect((await a.get("/api/notes?search=.*")).body.total).toBe(0);
  });
});
