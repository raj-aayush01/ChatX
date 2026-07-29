const { describe, it } = require("node:test");
const assert = require("node:assert");
const request = require("supertest");
const app = require("../app");

describe("Backend API Routes & Health Checks", () => {
    it("GET /api/health - should return status OK (200)", async () => {
        const response = await request(app).get("/api/health");
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.body.status, "OK");
    });

    it("POST /api/auth/signup - should return 400 when missing required fields", async () => {
        const response = await request(app)
            .post("/api/auth/signup")
            .send({});
        assert.strictEqual(response.status, 400);
        assert.strictEqual(response.body.message, "All fields are required");
    });

    it("POST /api/auth/login - should return 400 when missing credentials", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({ email: "" });
        assert.strictEqual(response.status, 400);
        assert.strictEqual(response.body.message, "All fields are required");
    });

    it("POST /api/auth/logout - should return 200 and success message", async () => {
        const response = await request(app).post("/api/auth/logout");
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.body.success, true);
    });

    it("DELETE /api/chats/:chatId - should return 401 when unauthorized", async () => {
        const response = await request(app).delete("/api/chats/12345");
        assert.strictEqual(response.status, 401);
    });

    it("DELETE /api/messages/:messageId - should return 401 when unauthorized", async () => {
        const response = await request(app).delete("/api/messages/12345");
        assert.strictEqual(response.status, 401);
    });
});
