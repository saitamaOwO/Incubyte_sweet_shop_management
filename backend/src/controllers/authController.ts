import type { Response } from "express"
import type { AuthRequest } from "../middleware/auth.js"
import { prisma } from "../index.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ error: true, message: "Missing required fields" })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ error: true, message: "Email already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "CUSTOMER",
      },
    })

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRE || "7d",
    })

    res.status(201).json({
      error: false,
      message: "User registered successfully",
      payload: { user, token },
    })
  } catch (error) {
    console.error("Register error:", error)
    res.status(500).json({ error: true, message: "Internal server error" })
  }
}

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: true, message: "Missing email or password" })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || user.role === "ADMIN") {
      return res.status(401).json({ error: true, message: "Invalid credentials" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: true, message: "Invalid credentials" })
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRE || "7d",
    })

    res.status(200).json({
      error: false,
      message: "Login successful",
      payload: { user, token },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: true, message: "Internal server error" })
  }
}

export const loginAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: true, message: "Missing email or password" })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || user.role !== "ADMIN") {
      return res.status(401).json({ error: true, message: "Invalid credentials" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: true, message: "Invalid credentials" })
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRE || "7d",
    })

    res.status(200).json({
      error: false,
      message: "Admin login successful",
      payload: { user, token },
    })
  } catch (error) {
    console.error("Admin login error:", error)
    res.status(500).json({ error: true, message: "Internal server error" })
  }
}
