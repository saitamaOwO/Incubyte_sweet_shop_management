import { prisma } from "./index.js"
import bcrypt from "bcrypt"

async function seed() {
  try {
    // Create admin user
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 10)
    await prisma.user.upsert({
      where: { email: "admin@sweetshop.com" },
      update: {},
      create: {
        email: "admin@sweetshop.com",
        password: adminPassword,
        name: "Admin",
        role: "ADMIN",
      },
    })

    // Create sample sweets
    const sweets = [
      {
        name: "Chocolate Fudge",
        description: "Rich and creamy chocolate fudge",
        price: 5.99,
        stock: 50,
        category: "Chocolate",
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
      },
      {
        name: "Strawberry Cake",
        description: "Fresh strawberry sponge cake",
        price: 7.99,
        stock: 30,
        category: "Cake",
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
      },
      {
        name: "Caramel Candy",
        description: "Sweet and sticky caramel candy",
        price: 3.99,
        stock: 100,
        category: "Candy",
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
      },
    ]

    for (const sweet of sweets) {
      await prisma.sweet.upsert({
        where: { name: sweet.name },
        update: {},
        create: sweet,
      })
    }

    console.log("Seed completed successfully")
  } catch (error) {
    console.error("Seed error:", error)
  } finally {
    await prisma.$disconnect()
  }
}

seed()
