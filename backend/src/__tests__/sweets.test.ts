import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

describe("Sweets Management", () => {
  let sweetId: string

  beforeAll(async () => {
    await prisma.sweet.deleteMany({})
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  test("should create a sweet", async () => {
    const sweet = await prisma.sweet.create({
      data: {
        name: "Test Sweet",
        description: "Test Description",
        price: 5.99,
        stock: 100,
        category: "Test",
        imageUrl: "https://example.com/image.jpg",
      },
    })
    sweetId = sweet.id
    expect(sweet.name).toBe("Test Sweet")
    expect(sweet.stock).toBe(100)
  })

  test("should get sweet by id", async () => {
    const sweet = await prisma.sweet.findUnique({ where: { id: sweetId } })
    expect(sweet?.id).toBe(sweetId)
  })

  test("should update sweet stock", async () => {
    const updated = await prisma.sweet.update({
      where: { id: sweetId },
      data: { stock: 50 },
    })
    expect(updated.stock).toBe(50)
  })

  test("should search sweet by name", async () => {
    const sweets = await prisma.sweet.findMany({
      where: { name: { contains: "Test", mode: "insensitive" } },
    })
    expect(sweets.length).toBeGreaterThan(0)
  })

  test("should delete sweet", async () => {
    await prisma.sweet.delete({ where: { id: sweetId } })
    const sweet = await prisma.sweet.findUnique({ where: { id: sweetId } })
    expect(sweet).toBeNull()
  })
})
