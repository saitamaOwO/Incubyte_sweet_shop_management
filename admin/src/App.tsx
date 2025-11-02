"use client"

import { useState, useEffect } from "react"
import AdminDashboard from "./components/AdminDashboard"
import AdminLogin from "./components/AdminLogin"
import "./App.css"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("adminToken"))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  if (loading) return <div className="loading">Loading...</div>

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
  }

  return <AdminDashboard onLogout={() => setIsAuthenticated(false)} />
}

export default App
