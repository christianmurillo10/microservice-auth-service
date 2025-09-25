import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../app";

describe("Auth - E2E", () => {
  const noutFoundId = "not-found-id";
  let id = "";
  let headers = {};

  beforeAll(async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "superadmin@email.com", password: "password" });

    headers = { "authorization": `Bearer ${res.body.data.token}` };
  });

  it("should create organization", async () => {
    const res = await request(app)
      .post("/organizations")
      .set(headers)
      .send({ name: "Test Organization" });
    expect(res.status).toBe(201);

    id = res.body.data.id;
  });

  it("should fail create organization if name exist", async () => {
    const res = await request(app)
      .post("/organizations")
      .set(headers)
      .send({ name: "Test Organization" });
    expect(res.status).toBe(409);
  });

  it("should update organization", async () => {
    const res = await request(app)
      .put(`/organizations/${id}`)
      .set(headers)
      .send({ name: "Test Organization - updated" });
    expect(res.status).toBe(200);
  });

  it("should fail update organization if id not found", async () => {
    const res = await request(app)
      .put(`/organizations/${noutFoundId}`)
      .set(headers)
      .send({ name: "Test Organization - updated" });
    expect(res.status).toBe(404);
  });

  it("should read organization", async () => {
    const res = await request(app)
      .get(`/organizations/${id}`)
      .set(headers);
    expect(res.status).toBe(200);
  });

  it("should fail read organization if id not found", async () => {
    const res = await request(app)
      .get(`/organizations/${noutFoundId}`)
      .set(headers);
    expect(res.status).toBe(404);
  });

  it("should list organizations", async () => {
    const res = await request(app)
      .get("/organizations")
      .set(headers);
    expect(res.status).toBe(200);
  });

  it("should delete organization", async () => {
    const res = await request(app)
      .delete(`/organizations/${id}`)
      .set(headers);
    expect(res.status).toBe(200);
  });
});