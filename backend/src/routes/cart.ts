import express, { type Router } from "express"
import { verifyToken } from "../middleware/auth.js"
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from "../controllers/cartController.js"

const router: Router = express.Router()

router.get("/", verifyToken, getCart)
router.post("/add", verifyToken, addToCart)
router.put("/update/:itemId", verifyToken, updateCartItem)
router.delete("/remove/:itemId", verifyToken, removeFromCart)
router.delete("/clear", verifyToken, clearCart)

export default router
