import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../app";

describe("Role - E2E", () => {
  const noutFoundId = "not-found-id";
  let id = "";
  let headers = {};

  beforeAll(async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "superadmin@email.com", password: "password" });

    headers = { "authorization": `Bearer ${res.body.data.token}` };
  });

  it("should create role", async () => {
    const res = await request(app)
      .post("/roles")
      .set(headers)
      .send({ name: "Test Role" });
    expect(res.status).toBe(201);

    id = res.body.data.id;
  });

  it("should fail create role if duplicate", async () => {
    const res = await request(app)
      .post("/roles")
      .set(headers)
      .send({ name: "Test Role" });
    expect(res.status).toBe(409);
  });

  it("should update role", async () => {
    const res = await request(app)
      .put(`/roles/${id}`)
      .set(headers)
      .send({ name: "Test Role - updated" });
    expect(res.status).toBe(200);
  });

  it("should fail update role if id not found", async () => {
    const res = await request(app)
      .put(`/roles/${noutFoundId}`)
      .set(headers)
      .send({ name: "Test Role - updated" });
    expect(res.status).toBe(404);
  });

  it("should read role", async () => {
    const res = await request(app)
      .get(`/roles/${id}`)
      .set(headers);
    expect(res.status).toBe(200);
  });

  it("should fail read role if id not found", async () => {
    const res = await request(app)
      .get(`/roles/${noutFoundId}`)
      .set(headers);
    expect(res.status).toBe(404);
  });

  it("should list roles", async () => {
    const res = await request(app)
      .get("/roles")
      .set(headers);
    expect(res.status).toBe(200);
  });

  it("should delete role", async () => {
    const res = await request(app)
      .delete(`/roles/${id}`)
      .set(headers);
    expect(res.status).toBe(200);
  });
});