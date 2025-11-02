import express, { type Router } from "express"
import { verifyToken, isAdmin } from "../middleware/auth.js"
import {
  getAllSweets,
  getSweetById,
  createSweet,
  updateSweet,
  deleteSweet,
  searchSweets,
} from "../controllers/sweetsController.js"

const router: Router = express.Router()

router.get("/", getAllSweets)
router.get("/search", searchSweets)
router.get("/:id", getSweetById)
router.post("/", verifyToken, isAdmin, createSweet)
router.put("/:id", verifyToken, isAdmin, updateSweet)
router.delete("/:id", verifyToken, isAdmin, deleteSweet)

export default router
