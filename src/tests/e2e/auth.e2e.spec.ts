import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import http from "http";
import app from "../../app";

let server: http.Server;
let headers = {};
let refreshToken = "";

describe("Auth - E2E", () => {
  beforeAll(async () => {
    server = app.listen(0);
  });

  afterAll(async () => {
    server.close();
  });

  it("should login seeded admin", async () => {
    const res = await request(server)
      .post("/auth/login")
      .send({ email: "superadmin@email.com", password: "password" });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeTruthy();

    headers = { "authorization": `Bearer ${res.body.data.token}` };
    refreshToken = res.body.data.refreshToken;
  });

  it("should fail login with wrong credentials", async () => {
    const res = await request(server)
      .post("/auth/login")
      .send({ email: "superadmin@email.com", password: "wrong" });
    expect(res.status).toBe(400);
  });

  it("should fail logout without headers authorization", async () => {
    const res = await request(server).post("/auth/logout");
    expect(res.status).toBe(400);
  });

  it("should refresh token", async () => {
    const res = await request(server)
      .post("/auth/refresh-token")
      .set(headers)
      .send({ refreshToken });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeTruthy();

    headers = { "authorization": `Bearer ${res.body.data.token}` };
    refreshToken = res.body.data.refreshToken;
  });

  it("should fail refresh token without headers authorization", async () => {
    const res = await request(server)
      .post("/auth/refresh-token")
      .send({ refreshToken });
    expect(res.status).toBe(400);
  });

  it("should fail refresh token with empty refreshToken body", async () => {
    const res = await request(server)
      .post("/auth/refresh-token")
      .set(headers)
      .send({ refreshToken: "" });
    expect(res.status).toBe(400);
  });

  it("should fail refresh token with not found refreshToken body", async () => {
    const res = await request(server)
      .post("/auth/refresh-token")
      .set(headers)
      .send({ refreshToken: "not_found" });
    expect(res.status).toBe(404);
  });

  it("should logout", async () => {
    const res = await request(server)
      .post("/auth/logout")
      .set(headers);
    expect(res.status).toBe(200);
  });
});