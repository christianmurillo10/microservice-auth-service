import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../app";

describe("User Role - E2E", () => {
  const noutFoundId = "not-found-id";
  let id = "";
  let userId = "";
  let roleId = "";
  let headers = {};

  beforeAll(async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "superadmin@email.com", password: "password" });

    headers = { "authorization": `Bearer ${res.body.data.token}` };
    userId = res.body.data.userId;

    // Create and set roleId
    const resRole = await request(app)
      .post("/roles")
      .set(headers)
      .send({ name: "Test Role for user role" });
    roleId = resRole.body.data.id;
  });

  it("should create user role", async () => {
    const res = await request(app)
      .post(`/users/${userId}/roles`)
      .set(headers)
      .send({ roleId });
    expect(res.status).toBe(201);

    id = res.body.data.id;
  });

  it("should fail create user role if duplicate", async () => {
    const res = await request(app)
      .post(`/users/${userId}/roles`)
      .set(headers)
      .send({ roleId });
    expect(res.status).toBe(409);
  });

  it("should sync user role", async () => {
    const res = await request(app)
      .put(`/users/${userId}/roles/sync`)
      .set(headers)
      .send({ roleIds: [roleId] });
    expect(res.status).toBe(200);
  });

  it("should read user role", async () => {
    const res = await request(app)
      .get(`/users/${userId}/roles/${id}`)
      .set(headers);
    expect(res.status).toBe(200);
  });

  it("should fail read user role if id not found", async () => {
    const res = await request(app)
      .get(`/users/${userId}/roles/${noutFoundId}`)
      .set(headers);
    expect(res.status).toBe(404);
  });

  it("should list user roles", async () => {
    const res = await request(app)
      .get(`/users/${userId}/roles`)
      .set(headers);
    expect(res.status).toBe(200);
  });

  it("should delete user role", async () => {
    const res = await request(app)
      .delete(`/users/${userId}/roles/${id}`)
      .set(headers);
    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    // Delete created role
    await request(app)
      .delete(`/roles/${roleId}`)
      .set(headers);
  });
});