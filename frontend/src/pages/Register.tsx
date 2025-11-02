"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { authAPI } from "../api"
import "./Auth.css"

interface RegisterProps {
  onRegisterSuccess?: () => void
}

export default function Register({ onRegisterSuccess }: RegisterProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      setLoading(true)
      const response = await authAPI.register({ name, email, password })
      const { user, token } = response.data.payload
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
      onRegisterSuccess?.()
      navigate("/")
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Registration failed. Please try again."
      setError(errorMsg)
      console.error("Registration error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <form onSubmit={handleRegister} className="auth-form">
        <h1>Create Account</h1>
        {error && <div className="error-message">{error}</div>}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading} className="auth-btn">
          {loading ? "Registering..." : "Register"}
        </button>
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  )
}
