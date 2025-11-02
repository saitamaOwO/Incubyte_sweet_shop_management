import type { Response } from "express"
import type { AuthRequest } from "../middleware/auth.js"
import { prisma } from "../index.js"

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    let cart = await prisma.cart.findUnique({
      where: { userId: req.userId! },
      include: { items: { include: { sweet: true } } },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.userId! },
        include: { items: { include: { sweet: true } } },
      })
    }

    res.status(200).json({
      error: false,
      message: "Cart fetched successfully",
      payload: cart,
    })
  } catch (error) {
    console.error("Get cart error:", error)
    res.status(500).json({ error: true, message: "Internal server error" })
  }
}

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { sweetId, quantity } = req.body

    if (!sweetId || !quantity) {
      return res.status(400).json({ error: true, message: "Missing sweetId or quantity" })
    }

    const sweet = await prisma.sweet.findUnique({ where: { id: sweetId } })
    if (!sweet) {
      return res.status(404).json({ error: true, message: "Sweet not found" })
    }

    if (sweet.stock < quantity) {
      return res.status(400).json({ error: true, message: "Insufficient stock" })
    }

    let cart = await prisma.cart.findUnique({ where: { userId: req.userId! } })
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: req.userId! } })
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_sweetId: { cartId: cart.id, sweetId } },
    })

    let cartItem
    if (existingItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { sweet: true },
      })
    } else {
      cartItem = await prisma.cartItem.create({
        data: { cartId: cart.id, sweetId, quantity },
        include: { sweet: true },
      })
    }

    res.status(200).json({
      error: false,
      message: "Item added to cart",
      payload: cartItem,
    })
  } catch (error) {
    console.error("Add to cart error:", error)
    res.status(500).json({ error: true, message: "Internal server error" })
  }
}

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const { quantity } = req.body

    if (!quantity || quantity < 0) {
      return res.status(400).json({ error: true, message: "Invalid quantity" })
    }

    const cartItem = await prisma.cartItem.findUnique({ where: { id: req.params.itemId } })
    if (!cartItem) {
      return res.status(404).json({ error: true, message: "Cart item not found" })
    }

    const sweet = await prisma.sweet.findUnique({ where: { id: cartItem.sweetId } })
    if (sweet && sweet.stock < quantity) {
      return res.status(400).json({ error: true, message: "Insufficient stock" })
    }

    const updated = await prisma.cartItem.update({
      where: { id: req.params.itemId },
      data: { quantity },
      include: { sweet: true },
    })

    res.status(200).json({
      error: false,
      message: "Cart item updated",
      payload: updated,
    })
  } catch (error) {
    console.error("Update cart item error:", error)
    res.status(500).json({ error: true, message: "Internal server error" })
  }
}

export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.cartItem.delete({ where: { id: req.params.itemId } })
    res.status(200).json({
      error: false,
      message: "Item removed from cart",
    })
  } catch (error) {
    console.error("Remove from cart error:", error)
    res.status(500).json({ error: true, message: "Internal server error" })
  }
}

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await prisma.cart.findUnique({ where: { userId: req.userId! } })
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
    }
    res.status(200).json({
      error: false,
      message: "Cart cleared",
    })
  } catch (error) {
    console.error("Clear cart error:", error)
    res.status(500).json({ error: true, message: "Internal server error" })
  }
}
