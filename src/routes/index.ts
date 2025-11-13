import { Router, Request, Response } from "express"
import authRoutes from "./auth.routes"
import userRoutes from "./user.routes"
import productRoutes from "./product.routes"

const router = Router()

router.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

router.use("/auth", authRoutes)
router.use("/users", userRoutes)
router.use("/products", productRoutes)

export default router

