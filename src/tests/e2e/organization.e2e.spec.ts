import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import http from "http";
import { PrismaClient } from "../../prisma/client";
import app from "../../app";

const prisma = new PrismaClient();
const noutFoundId = "not-found-id";
let server: http.Server;
let id = "";
let headers = {};

describe("Organization - E2E", () => {
  beforeAll(async () => {
    server = app.listen(0);

    const res = await request(server)
      .post("/auth/login")
      .send({ email: "superadmin@email.com", password: "password" });
    headers = { "authorization": `Bearer ${res.body.data.token}` };
  });

  afterAll(async () => {
    await prisma.organization.delete({ where: { id } });
    await prisma.$disconnect();
    server.close();
  });

  it("should create organization", async () => {
    const res = await request(server)
      .post("/organizations")
      .set(headers)
      .send({ name: "Test Organization" });
    expect(res.status).toBe(201);

    id = res.body.data.id;
  });

  it("should fail create organization if duplicate", async () => {
    const res = await request(server)
      .post("/organizations")
      .set(headers)
      .send({ name: "Test Organization" });
    expect(res.status).toBe(409);
  });

  it("should update organization", async () => {
    const res = await request(server)
      .put(`/organizations/${id}`)
      .set(headers)
      .send({ name: "Test Organization - updated" });
    expect(res.status).toBe(200);
  });

  it("should fail update organization if id not found", async () => {
    const res = await request(server)
      .put(`/organizations/${noutFoundId}`)
      .set(headers)
      .send({ name: "Test Organization - updated" });
    expect(res.status).toBe(404);
  });

  it("should read organization", async () => {
    const res = await request(server)
      .get(`/organizations/${id}`)
      .set(headers);
    expect(res.status).toBe(200);
  });

  it("should fail read organization if id not found", async () => {
    const res = await request(server)
      .get(`/organizations/${noutFoundId}`)
      .set(headers);
    expect(res.status).toBe(404);
  });

  it("should list organizations", async () => {
    const res = await request(server)
      .get("/organizations")
      .set(headers);
    expect(res.status).toBe(200);
  });

  it("should delete organization", async () => {
    const res = await request(server)
      .delete(`/organizations/${id}`)
      .set(headers);
    expect(res.status).toBe(200);
  });
});