import express, { type Router } from "express"
import { verifyToken } from "../middleware/auth.js"
import { createOrder, getOrders, getOrderById } from "../controllers/ordersController.js"

const router: Router = express.Router()

router.post("/", verifyToken, createOrder)
router.get("/", verifyToken, getOrders)
router.get("/:id", verifyToken, getOrderById)

export default router
