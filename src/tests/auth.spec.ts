import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";

describe("Auth Service", () => {
  it("should login seeded admin", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "superadmin@email.com",
      password: "password"
    });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeTruthy();
  });

  it("should fail login with wrong credentials", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "superadmin@email.com",
      password: "wrong"
    });
    expect(res.status).toBe(400);
  });
});