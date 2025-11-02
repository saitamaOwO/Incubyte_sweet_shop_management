import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import { fail } from "assert"

const prisma = new PrismaClient()

describe("Authentication", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany({})
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  test("should register a new user", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: await bcrypt.hash("password123", 10),
        name: "Test User",
        role: "CUSTOMER",
      },
    })
    expect(user.email).toBe("test@example.com")
  })

  test("should not register duplicate email", async () => {
    try {
      await prisma.user.create({
        data: {
          email: "test@example.com",
          password: await bcrypt.hash("password123", 10),
          name: "Another User",
          role: "CUSTOMER",
        },
      })
      fail("Should have thrown an error")
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  test("should verify password correctly", async () => {
    const password = "testpass123"
    const hashedPassword = await bcrypt.hash(password, 10)
    const isValid = await bcrypt.compare(password, hashedPassword)
    expect(isValid).toBe(true)
  })

  test("should reject invalid password", async () => {
    const hashedPassword = await bcrypt.hash("password123", 10)
    const isValid = await bcrypt.compare("wrongpassword", hashedPassword)
    expect(isValid).toBe(false)
  })

  test("should create admin user", async () => {
    const admin = await prisma.user.create({
      data: {
        email: "admin@example.com",
        password: await bcrypt.hash("admin123", 10),
        name: "Admin User",
        role: "ADMIN",
      },
    })
    expect(admin.role).toBe("ADMIN")
  })
})
