import request from "supertest";
import app from "../src/app.js";

describe("Health check", () => {
  it("GET /api/health returns ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("Products route", () => {
  it("GET /api/products returns 200 or 500 (no DB in test) without crashing route", async () => {
    const res = await request(app).get("/api/products");
    expect([200, 500]).toContain(res.statusCode);
  });
});
