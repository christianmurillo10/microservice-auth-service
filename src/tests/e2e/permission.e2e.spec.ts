import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../app";

describe("Permission - E2E", () => {
  const noutFoundId = "not-found-id";
  let id = "";
  let headers = {};

  beforeAll(async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "superadmin@email.com", password: "password" });

    headers = { "authorization": `Bearer ${res.body.data.token}` };
  });

  it("should create permission", async () => {
    const res = await request(app)
      .post("/permissions")
      .set(headers)
      .send({ action: "test-action", resource: "test-resource" });
    expect(res.status).toBe(201);

    id = res.body.data.id;
  });

  it("should fail create permission if duplicate", async () => {
    const res = await request(app)
      .post("/permissions")
      .set(headers)
      .send({ action: "test-action", resource: "test-resource" });
    expect(res.status).toBe(409);
  });

  it("should update permission", async () => {
    const res = await request(app)
      .put(`/permissions/${id}`)
      .set(headers)
      .send({ action: "test-action", resource: "test-resource" });
    expect(res.status).toBe(200);
  });

  it("should fail update permission if id not found", async () => {
    const res = await request(app)
      .put(`/permissions/${noutFoundId}`)
      .set(headers)
      .send({ action: "test-action", resource: "test-resource" });
    expect(res.status).toBe(404);
  });

  it("should read permission", async () => {
    const res = await request(app)
      .get(`/permissions/${id}`)
      .set(headers);
    expect(res.status).toBe(200);
  });

  it("should fail read permission if id not found", async () => {
    const res = await request(app)
      .get(`/permissions/${noutFoundId}`)
      .set(headers);
    expect(res.status).toBe(404);
  });

  it("should list permissions", async () => {
    const res = await request(app)
      .get("/permissions")
      .set(headers);
    expect(res.status).toBe(200);
  });

  it("should delete permission", async () => {
    const res = await request(app)
      .delete(`/permissions/${id}`)
      .set(headers);
    expect(res.status).toBe(200);
  });
});