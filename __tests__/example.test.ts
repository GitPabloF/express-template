import request from "supertest"
import { Application } from "express"
import createApp from "../src/app"

describe("API Health Check", () => {
  let app: Application

  beforeAll(() => {
    app = createApp()
  })

  describe("GET /api/v1/health", () => {
    it("should return 200 status", async () => {
      const response = await request(app).get("/api/v1/health")
      expect(response.status).toBe(200)
    })

    it("should return success response", async () => {
      const response = await request(app).get("/api/v1/health")
      expect(response.body).toHaveProperty("success", true)
      expect(response.body).toHaveProperty("message", "API is running")
    })
  })

  describe("GET /", () => {
    it("should return API information", async () => {
      const response = await request(app).get("/")
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty("success", true)
    })
  })
})
