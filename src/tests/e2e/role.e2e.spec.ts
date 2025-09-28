import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../app";
import http from "http";
import { PrismaClient } from "../../prisma/client";

const prisma = new PrismaClient();
const noutFoundId = "not-found-id";
let server: http.Server;
let id = "";
let headers = {};

describe("Role - E2E", () => {
  beforeAll(async () => {
    server = app.listen(0);

    // Login as admin and set headers
    const res = await request(server)
      .post("/auth/login")
      .send({ email: "superadmin@email.com", password: "password" });
    headers = { "authorization": `Bearer ${res.body.data.token}` };
  });

  afterAll(async () => {
    await prisma.role.delete({ where: { id } });
    await prisma.$disconnect();
    server.close();
  });

  it("should create role", async () => {
    const res = await request(server)
      .post("/roles")
      .set(headers)
      .send({ name: "Test Role" });
    expect(res.status).toBe(201);

    id = res.body.data.id;
  });

  it("should fail create role if duplicate", async () => {
    const res = await request(server)
      .post("/roles")
      .set(headers)
      .send({ name: "Test Role" });
    expect(res.status).toBe(409);
  });

  it("should update role", async () => {
    const res = await request(server)
      .put(`/roles/${id}`)
      .set(headers)
      .send({ name: "Test Role - updated" });
    expect(res.status).toBe(200);
  });

  it("should fail update role if id not found", async () => {
    const res = await request(server)
      .put(`/roles/${noutFoundId}`)
      .set(headers)
      .send({ name: "Test Role - updated" });
    expect(res.status).toBe(404);
  });

  it("should read role", async () => {
    const res = await request(server)
      .get(`/roles/${id}`)
      .set(headers);
    expect(res.status).toBe(200);
  });

  it("should fail read role if id not found", async () => {
    const res = await request(server)
      .get(`/roles/${noutFoundId}`)
      .set(headers);
    expect(res.status).toBe(404);
  });

  it("should list roles", async () => {
    const res = await request(server)
      .get("/roles")
      .set(headers);
    expect(res.status).toBe(200);
  });

  it("should delete role", async () => {
    const res = await request(server)
      .delete(`/roles/${id}`)
      .set(headers);
    expect(res.status).toBe(200);
  });
});