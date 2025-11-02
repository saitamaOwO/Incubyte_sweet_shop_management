import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log("🌱 Starting database seed...");

    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 10);
    const admin = await prisma.user.upsert({
      where: { email: "admin@sweetshop.com" },
      update: {},
      create: {
        email: "admin@sweetshop.com",
        password: adminPassword,
        name: "Admin",
        role: "ADMIN",
      },
    });
    console.log(`👤 Admin user created/updated: ${admin.email}`);

    const sweets = [
      {
        name: "Chocolate Fudge",
        description: "Rich and creamy chocolate fudge made with premium cocoa",
        price: 5.99,
        stock: 50,
        category: "Chocolate",
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop",
      },
      {
        name: "Strawberry Cake",
        description: "Fresh strawberry sponge cake with whipped cream",
        price: 7.99,
        stock: 30,
        category: "Cake",
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop",
      },
      {
        name: "Caramel Candy",
        description: "Sweet and sticky caramel candy with butter notes",
        price: 3.99,
        stock: 100,
        category: "Candy",
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop",
      },
      {
        name: "Vanilla Pastry",
        description: "Delicate vanilla pastry with smooth cream filling",
        price: 4.99,
        stock: 75,
        category: "Pastry",
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop",
      },
      {
        name: "Mint Chocolate",
        description: "Refreshing mint chocolate bar with dark chocolate coating",
        price: 2.99,
        stock: 60,
        category: "Chocolate",
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop",
      },
      {
        name: "Lemon Drop",
        description: "Sour and sweet lemon flavored candy drops",
        price: 2.49,
        stock: 120,
        category: "Candy",
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop",
      },
      {
        name: "Cheesecake Slice",
        description: "New York style cheesecake with graham cracker crust",
        price: 8.99,
        stock: 25,
        category: "Cake",
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop",
      },
      {
        name: "Hazelnut Spread",
        description: "Creamy hazelnut spread with cocoa goodness",
        price: 6.99,
        stock: 40,
        category: "Spread",
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop",
      },
    ];

    let createdCount = 0;
    for (const sweet of sweets) {
      const result = await prisma.sweet.upsert({
        where: { name: sweet.name },
        update: sweet,
        create: sweet,
      });
      createdCount++;
      console.log(`🍬 Sweet upserted: ${result.name} (Stock: ${result.stock})`);
    }

    console.log("\n✅ Seed completed successfully!");
    console.log(`Total sweets: ${createdCount}`);
    console.log(`Admin Email: ${admin.email}`);
    console.log(`Admin Password: ${process.env.ADMIN_PASSWORD || "admin123"}`);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();