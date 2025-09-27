import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../app";

describe("Role Permission - E2E", () => {
  const noutFoundId = "not-found-id";
  let id = "";
  let roleId = "";
  let permissionId = "";
  let headers = {};

  beforeAll(async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "superadmin@email.com", password: "password" });

    headers = { "authorization": `Bearer ${res.body.data.token}` };

    // Create and set roleId
    const resRole = await request(app)
      .post("/roles")
      .set(headers)
      .send({ name: "Test Role for role permission" });
    roleId = resRole.body.data.id;

    // Create and set permissionId
    const resPermission = await request(app)
      .post("/permissions")
      .set(headers)
      .send({ action: "test-action for role permission", resource: "test-resource for role permission" });
    permissionId = resPermission.body.data.id;
  });

  it("should create role permission", async () => {
    const res = await request(app)
      .post(`/roles/${roleId}/permissions`)
      .set(headers)
      .send({ permissionId });
    expect(res.status).toBe(201);

    id = res.body.data.id;
  });

  it("should fail create role permission if duplicate", async () => {
    const res = await request(app)
      .post(`/roles/${roleId}/permissions`)
      .set(headers)
      .send({ permissionId });
    expect(res.status).toBe(409);
  });

  it("should sync role permission", async () => {
    const res = await request(app)
      .put(`/roles/${roleId}/permissions/sync`)
      .set(headers)
      .send({ permissionIds: [permissionId] });
    expect(res.status).toBe(200);
  });

  it("should read role permission", async () => {
    const res = await request(app)
      .get(`/roles/${roleId}/permissions/${id}`)
      .set(headers);
    expect(res.status).toBe(200);
  });

  it("should fail read role permission if id not found", async () => {
    const res = await request(app)
      .get(`/roles/${roleId}/permissions/${noutFoundId}`)
      .set(headers);
    expect(res.status).toBe(404);
  });

  it("should list role permissions", async () => {
    const res = await request(app)
      .get(`/roles/${roleId}/permissions`)
      .set(headers);
    expect(res.status).toBe(200);
  });

  it("should delete role permission", async () => {
    const res = await request(app)
      .delete(`/roles/${roleId}/permissions/${id}`)
      .set(headers);
    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    // Delete created role
    await request(app)
      .delete(`/roles/${roleId}`)
      .set(headers);

    // Delete created permission
    await request(app)
      .delete(`/permissions/${permissionId}`)
      .set(headers);
  });
});