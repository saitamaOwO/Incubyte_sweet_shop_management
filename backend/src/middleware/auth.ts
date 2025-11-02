import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export interface AuthRequest extends Request {
  userId?: string
  userRole?: string
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: true, message: "No token provided" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    req.userId = decoded.id
    req.userRole = decoded.role
    next()
  } catch (error) {
    return res.status(403).json({ error: true, message: "Invalid token" })
  }
}

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.userRole !== "ADMIN") {
    return res.status(403).json({ error: true, message: "Access denied. Admin only." })
  }
  next()
}
