import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import app from "../../app";
import { PrismaClient } from "../../prisma/client";

const prisma = new PrismaClient();
let token = "";
let refreshToken = "";

describe("Auth - Integration", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should login seeded admin", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "superadmin@email.com", password: "password" });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeTruthy();

    token = res.body.data.token;
    refreshToken = res.body.data.refreshToken;
  });

  it("should fail login with wrong credentials", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "superadmin@email.com", password: "wrong" });
    expect(res.status).toBe(400);
  });

  it("should fail logout without headers authorization", async () => {
    const res = await request(app).post("/auth/logout");
    expect(res.status).toBe(400);
  });

  it("should refresh token", async () => {
    const res = await request(app)
      .post("/auth/refresh-token")
      .set("Authorization", `Bearer ${token}`)
      .send({ refreshToken });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeTruthy();

    token = res.body.data.token;
    refreshToken = res.body.data.refreshToken;
  });

  it("should fail refresh token without headers authorization", async () => {
    const res = await request(app)
      .post("/auth/refresh-token")
      .send({ refreshToken });
    expect(res.status).toBe(400);
  });

  it("should fail refresh token with empty refreshToken body", async () => {
    const res = await request(app)
      .post("/auth/refresh-token")
      .set("Authorization", `Bearer ${token}`)
      .send({ refreshToken: "" });
    expect(res.status).toBe(400);
  });

  it("should fail refresh token with not found refreshToken body", async () => {
    const res = await request(app)
      .post("/auth/refresh-token")
      .set("Authorization", `Bearer ${token}`)
      .send({ refreshToken: "not_found" });
    expect(res.status).toBe(404);
  });

  it("should logout", async () => {
    const res = await request(app)
      .post("/auth/logout")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});