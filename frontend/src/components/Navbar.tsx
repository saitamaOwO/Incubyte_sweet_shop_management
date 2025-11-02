"use client"

import { Link } from "react-router-dom"
import { ShoppingCart, LogOut, User } from "lucide-react"
import "./Navbar.css"

interface NavbarProps {
  onLogout: () => void
}

export default function Navbar({ onLogout }: NavbarProps) {
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null
  const cartCount = localStorage.getItem("cartCount") || "0"

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🍬 Sweet Shop
        </Link>
        <div className="navbar-menu">
          <Link to="/" className="nav-link">
            Home
          </Link>
          {user && (
            <>
              <Link to="/orders" className="nav-link">
                Orders
              </Link>
              <Link to="/cart" className="nav-link cart-link">
                <ShoppingCart size={20} />
                <span className="cart-badge">{cartCount}</span>
              </Link>
              <div className="user-menu">
                <User size={20} />
                <span>{user.name}</span>
              </div>
            </>
          )}
          <button onClick={onLogout} className="logout-btn">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}