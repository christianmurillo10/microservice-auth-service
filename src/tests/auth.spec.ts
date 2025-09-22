// import { describe, it, expect } from "vitest";
// import request from "supertest";
// import app from "../app"; // Assuming your Express app is exported from app.ts

// describe("Auth Service", () => {
//   it("should login seeded admin", async () => {
//     const res = await request(app).post("/api/auth/login").send({ username: "superadmin", password: "password" })
//     expect(res.status).toBe(200)
//     expect(res.body.token).toBeTruthy()
//   })


//   it("should fail login with wrong credentials", async () => {
//     const res = await request(app).post("/api/auth/login").send({ username: "superadmin", password: "wrong" })
//     expect(res.status).toBe(401)
//   })


//   it("should register a new user and then login", async () => {
//     const username = "testuser"
//     const pw = "strongpassword"
//     const reg = await request(app).post("/api/auth/register").send({ username, password: pw })
//     expect(reg.status).toBe(201)
//     const login = await request(app).post("/api/auth/login").send({ username, password: pw })
//     expect(login.status).toBe(200)
//     expect(login.body.token).toBeTruthy()
//   })
// });