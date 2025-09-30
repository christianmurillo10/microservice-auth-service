import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../app";
import { PrismaClient } from "../../prisma/client";

const prisma = new PrismaClient();
const noutFoundId = "not-found-id";
let token = "";
let id = "";

describe("Role - Integration", () => {
  beforeAll(async () => {
    // Login as admin and set headers
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "superadmin@email.com", password: "password" });
    token = res.body.data.token;
  });

  afterAll(async () => {
    await prisma.role.delete({ where: { id } });
    await prisma.$disconnect();
  });

  it("should create role", async () => {
    const res = await request(app)
      .post("/roles")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Role" });
    expect(res.status).toBe(201);

    id = res.body.data.id;
  });

  it("should fail create role if duplicate", async () => {
    const res = await request(app)
      .post("/roles")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Role" });
    expect(res.status).toBe(409);
  });

  it("should update role", async () => {
    const res = await request(app)
      .put(`/roles/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Role - updated" });
    expect(res.status).toBe(200);
  });

  it("should fail update role if id not found", async () => {
    const res = await request(app)
      .put(`/roles/${noutFoundId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Role - updated" });
    expect(res.status).toBe(404);
  });

  it("should read role", async () => {
    const res = await request(app)
      .get(`/roles/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("should fail read role if id not found", async () => {
    const res = await request(app)
      .get(`/roles/${noutFoundId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it("should list roles", async () => {
    const res = await request(app)
      .get("/roles")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("should delete role", async () => {
    const res = await request(app)
      .delete(`/roles/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});