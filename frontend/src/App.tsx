import React, { useState, useEffect } from "react"
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Cart from "./pages/Cart"
import Orders from "./pages/Orders"
import Navbar from "./components/Navbar"
import "./App.css"

function ProtectedRoute({ element }: { element: React.ReactNode }) {
  const isLoggedIn = !!localStorage.getItem("token")
  return isLoggedIn ? element : <Navigate to="/login" replace />
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"))
  const navigate = useNavigate()

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
    navigate("/") 
  }

  const handleRegisterSuccess = () => {
    setIsLoggedIn(true)
    navigate("/")
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsLoggedIn(false)
    navigate("/login")
  }

  useEffect(() => {
    const syncAuth = () => setIsLoggedIn(!!localStorage.getItem("token"))
    window.addEventListener("storage", syncAuth)
    return () => window.removeEventListener("storage", syncAuth)
  }, [])

  return (
    <div className="app">
      {isLoggedIn && <Navbar onLogout={handleLogout} />}
      <Routes>
        {!isLoggedIn ? (
          <>
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<Register onRegisterSuccess={handleRegisterSuccess} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
            <Route path="/orders" element={<ProtectedRoute element={<Orders />} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </div>
  )
}

export default App
