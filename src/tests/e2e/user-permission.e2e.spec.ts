import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../app";

describe("User Permission - E2E", () => {
  const noutFoundId = "not-found-id";
  let id = "";
  let userId = "";
  let permissionId = "";
  let headers = {};

  beforeAll(async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "superadmin@email.com", password: "password" });

    headers = { "authorization": `Bearer ${res.body.data.token}` };
    userId = res.body.data.userId;

    // Create and set permissionId
    const resPermission = await request(app)
      .post("/permissions")
      .set(headers)
      .send({ action: "test-action for user permission", resource: "test-resource for user permission" });
    permissionId = resPermission.body.data.id;
  });

  it("should create user permission", async () => {
    const res = await request(app)
      .post(`/users/${userId}/permissions`)
      .set(headers)
      .send({ permissionId });
    expect(res.status).toBe(201);

    id = res.body.data.id;
  });

  it("should fail create user permission if duplicate", async () => {
    const res = await request(app)
      .post(`/users/${userId}/permissions`)
      .set(headers)
      .send({ permissionId });
    expect(res.status).toBe(409);
  });

  it("should sync user permission", async () => {
    const res = await request(app)
      .put(`/users/${userId}/permissions/sync`)
      .set(headers)
      .send({ permissionIds: [permissionId] });
    expect(res.status).toBe(200);
  });

  it("should read user permission", async () => {
    const res = await request(app)
      .get(`/users/${userId}/permissions/${id}`)
      .set(headers);
    expect(res.status).toBe(200);
  });

  it("should fail read user permission if id not found", async () => {
    const res = await request(app)
      .get(`/users/${userId}/permissions/${noutFoundId}`)
      .set(headers);
    expect(res.status).toBe(404);
  });

  it("should list user permissions", async () => {
    const res = await request(app)
      .get(`/users/${userId}/permissions`)
      .set(headers);
    expect(res.status).toBe(200);
  });

  it("should delete user permission", async () => {
    const res = await request(app)
      .delete(`/users/${userId}/permissions/${id}`)
      .set(headers);
    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    // Delete created user
    await request(app)
      .delete(`/users/${userId}`)
      .set(headers);

    // Delete created permission
    await request(app)
      .delete(`/permissions/${permissionId}`)
      .set(headers);
  });
});