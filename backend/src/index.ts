import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import { PrismaClient } from "@prisma/client"
import authRoutes from "./routes/auth.js"
import sweetRoutes from "./routes/sweets.js"
import cartRoutes from "./routes/cart.js"
import orderRoutes from "./routes/orders.js"
import { errorHandler } from "./middleware/errorHandler.js"

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/api/auth", authRoutes)
app.use("/api/sweets", sweetRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/orders", orderRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export { prisma }
