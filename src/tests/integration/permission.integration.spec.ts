import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../app";
import { PrismaClient } from "../../prisma/client";

const prisma = new PrismaClient();
const noutFoundId = "not-found-id";
let token = "";
let id = "";

describe("Permission - Integration", () => {
  beforeAll(async () => {
    // Login as admin and set headers
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "superadmin@email.com", password: "password" });
    token = res.body.data.token;
  });

  afterAll(async () => {
    await prisma.permission.delete({ where: { id } });
    await prisma.$disconnect();
  });

  it("should create permission", async () => {
    const res = await request(app)
      .post("/permissions")
      .set("Authorization", `Bearer ${token}`)
      .send({ action: "test-action", resource: "test-resource" });
    expect(res.status).toBe(201);

    id = res.body.data.id;
  });

  it("should fail create permission if duplicate", async () => {
    const res = await request(app)
      .post("/permissions")
      .set("Authorization", `Bearer ${token}`)
      .send({ action: "test-action", resource: "test-resource" });
    expect(res.status).toBe(409);
  });

  it("should update permission", async () => {
    const res = await request(app)
      .put(`/permissions/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ action: "test-action", resource: "test-resource" });
    expect(res.status).toBe(200);
  });

  it("should fail update permission if id not found", async () => {
    const res = await request(app)
      .put(`/permissions/${noutFoundId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ action: "test-action", resource: "test-resource" });
    expect(res.status).toBe(404);
  });

  it("should read permission", async () => {
    const res = await request(app)
      .get(`/permissions/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("should fail read permission if id not found", async () => {
    const res = await request(app)
      .get(`/permissions/${noutFoundId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it("should list permissions", async () => {
    const res = await request(app)
      .get("/permissions")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("should delete permission", async () => {
    const res = await request(app)
      .delete(`/permissions/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});