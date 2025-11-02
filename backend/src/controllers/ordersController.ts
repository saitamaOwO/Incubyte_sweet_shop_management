import type { Response } from "express"
import type { AuthRequest } from "../middleware/auth.js"
import { prisma } from "../index.js"

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.userId! },
      include: { items: { include: { sweet: true } } },
    })

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: true, message: "Cart is empty" })
    }

    let total = 0
    const orderItems = cart.items.map((item) => {
      total += item.sweet.price * item.quantity
      return {
        sweetId: item.sweetId,
        quantity: item.quantity,
        price: item.sweet.price,
      }
    })

    const order = await prisma.order.create({
      data: {
        userId: req.userId!,
        total,
        items: { create: orderItems },
      },
      include: { items: { include: { sweet: true } } },
    })

    // Reduce stock for each item
    for (const item of cart.items) {
      await prisma.sweet.update({
        where: { id: item.sweetId },
        data: { stock: { decrement: item.quantity } },
      })
    }

    // Clear cart
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })

    res.status(201).json({
      error: false,
      message: "Order created successfully",
      payload: order,
    })
  } catch (error) {
    console.error("Create order error:", error)
    res.status(500).json({ error: true, message: "Internal server error" })
  }
}

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number.parseInt(req.query.page as string) || 1
    const limit = Number.parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: req.userId! },
        include: { items: { include: { sweet: true } } },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where: { userId: req.userId! } }),
    ])

    res.status(200).json({
      error: false,
      message: "Orders fetched successfully",
      payload: {
        orders,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
    })
  } catch (error) {
    console.error("Get orders error:", error)
    res.status(500).json({ error: true, message: "Internal server error" })
  }
}

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: { include: { sweet: true } } },
    })

    if (!order) {
      return res.status(404).json({ error: true, message: "Order not found" })
    }

    if (order.userId !== req.userId) {
      return res.status(403).json({ error: true, message: "Unauthorized" })
    }

    res.status(200).json({
      error: false,
      message: "Order fetched successfully",
      payload: order,
    })
  } catch (error) {
    console.error("Get order error:", error)
    res.status(500).json({ error: true, message: "Internal server error" })
  }
}
