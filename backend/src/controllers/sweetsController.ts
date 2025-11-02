import type { Response } from "express"
import type { AuthRequest } from "../middleware/auth.js"
import { prisma } from "../index.js"

export const getAllSweets = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number.parseInt(req.query.page as string) || 1
    const limit = Number.parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const [sweets, total] = await Promise.all([
      prisma.sweet.findMany({ skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.sweet.count(),
    ])

    res.status(200).json({
      error: false,
      message: "Sweets fetched successfully",
      payload: {
        sweets,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
    })
  } catch (error) {
    console.error("Get sweets error:", error)
    res.status(500).json({ error: true, message: "Internal server error" })
  }
}

export const getSweetById = async (req: AuthRequest, res: Response) => {
  try {
    const sweet = await prisma.sweet.findUnique({ where: { id: req.params.id } })
    if (!sweet) {
      return res.status(404).json({ error: true, message: "Sweet not found" })
    }
    res.status(200).json({
      error: false,
      message: "Sweet fetched successfully",
      payload: sweet,
    })
  } catch (error) {
    console.error("Get sweet error:", error)
    res.status(500).json({ error: true, message: "Internal server error" })
  }
}

export const createSweet = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, price, stock, category, imageUrl } = req.body

    if (!name || !price || !category) {
      return res.status(400).json({ error: true, message: "Missing required fields" })
    }

    const sweet = await prisma.sweet.create({
      data: {
        name,
        description,
        price: Number.parseFloat(price),
        stock: Number.parseInt(stock) || 0,
        category,
        imageUrl,
      },
    })

    res.status(201).json({
      error: false,
      message: "Sweet created successfully",
      payload: sweet,
    })
  } catch (error) {
    console.error("Create sweet error:", error)
    res.status(500).json({ error: true, message: "Internal server error" })
  }
}

export const updateSweet = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, price, stock, category, imageUrl } = req.body

    const sweet = await prisma.sweet.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price: Number.parseFloat(price) }),
        ...(stock !== undefined && { stock: Number.parseInt(stock) }),
        ...(category && { category }),
        ...(imageUrl && { imageUrl }),
      },
    })

    res.status(200).json({
      error: false,
      message: "Sweet updated successfully",
      payload: sweet,
    })
  } catch (error) {
    console.error("Update sweet error:", error)
    res.status(500).json({ error: true, message: "Internal server error" })
  }
}

export const deleteSweet = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.sweet.delete({ where: { id: req.params.id } })
    res.status(200).json({
      error: false,
      message: "Sweet deleted successfully",
    })
  } catch (error) {
    console.error("Delete sweet error:", error)
    res.status(500).json({ error: true, message: "Internal server error" })
  }
}

export const searchSweets = async (req: AuthRequest, res: Response) => {
  try {
    const { query, category, minPrice, maxPrice } = req.query

    const where: any = {}
    if (query) {
      where.name = { contains: query as string, mode: "insensitive" }
    }
    if (category) {
      where.category = category
    }
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = Number.parseFloat(minPrice as string)
      if (maxPrice) where.price.lte = Number.parseFloat(maxPrice as string)
    }

    const sweets = await prisma.sweet.findMany({ where, orderBy: { createdAt: "desc" } })

    res.status(200).json({
      error: false,
      message: "Search results",
      payload: sweets,
    })
  } catch (error) {
    console.error("Search error:", error)
    res.status(500).json({ error: true, message: "Internal server error" })
  }
}
