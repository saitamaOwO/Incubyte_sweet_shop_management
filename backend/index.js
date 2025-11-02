import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import { PrismaClient } from "@prisma/client"
import authRoutes from "./routes/auth.js"
import sweetRoutes from "./routes/sweets.js"
import cartRoutes from "./routes/cart.js"
import orderRoutes from "./routes/orders.js"
import { errorHandler } from "./middleware/errorHandler.js"

if (!process.env.DATABASE_URL) {
  console.error("\n❌ ERROR: DATABASE_URL environment variable is not set!")
  console.error("Please follow these steps to fix this:\n")
  console.error("1. Copy .env.example to .env:")
  console.error("   cp .env.example .env\n")
  console.error("2. Get your MongoDB connection string:")
  console.error("   - Go to https://www.mongodb.com/cloud/atlas")
  console.error("   - Create a free account and cluster")
  console.error("   - Get your connection string from the 'Connect' button\n")
  console.error("3. Update backend/.env with your MongoDB URL:")
  console.error(
    "   DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/sweet_shop?retryWrites=true&w=majority\n",
  )
  console.error("4. Run: npm start\n")
  process.exit(1)
}

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/sweets", sweetRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/orders", orderRoutes)

// Error handling middleware
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ Backend server running on http://localhost:${PORT}`)
  console.log(`📦 Database: MongoDB Connected`)
  console.log(`🔐 Admin Email: admin@sweetshop.com`)
  console.log(`\nReady to accept requests!\n`)
})

export { prisma }
