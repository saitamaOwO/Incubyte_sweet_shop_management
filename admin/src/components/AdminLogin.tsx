"use client"

import type React from "react"

import { useState } from "react"
import { authAPI } from "../api"
import "../styles/AdminLogin.css"

interface AdminLoginProps {
  onLoginSuccess: () => void
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await authAPI.loginAdmin({ email, password })
      const { user, token } = response.data.payload
      localStorage.setItem("adminToken", token)
      localStorage.setItem("adminUser", JSON.stringify(user))
      onLoginSuccess()
    } catch (error: any) {
      alert(error.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-container">
      <form onSubmit={handleLogin} className="admin-login-form">
        <h1>🍬 Admin Dashboard</h1>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Admin Login"}
        </button>
        <p className="demo-creds">Demo: admin@sweetshop.com / admin123</p>
      </form>
    </div>
  )
}
