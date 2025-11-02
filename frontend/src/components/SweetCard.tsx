"use client"

import { ShoppingCart, Plus, Minus } from "lucide-react"
import { useState } from "react"
import { cartAPI } from "../api"
import "./SweetCard.css"

interface SweetCardProps {
  sweet: {
    id: string
    name: string
    description: string
    price: number
    stock: number
    imageUrl: string
  }
  onAddSuccess?: () => void
}

export default function SweetCard({ sweet, onAddSuccess }: SweetCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const isLoggedIn = !!localStorage.getItem("token")

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      window.location.href = "/login"
      return
    }

    try {
      setLoading(true)
      await cartAPI.addToCart({ sweetId: sweet.id, quantity })

      // Update cart count
      const currentCount = Number.parseInt(localStorage.getItem("cartCount") || "0")
      localStorage.setItem("cartCount", (currentCount + quantity).toString())

      setQuantity(1)
      alert("Added to cart!")
      onAddSuccess?.()
    } catch (error: any) {
      alert(error.response?.data?.message || "Error adding to cart")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="sweet-card">
      <div className="card-image">
        <img src={sweet.imageUrl || "/placeholder.svg"} alt={sweet.name} />
        {sweet.stock === 0 && <div className="out-of-stock">Out of Stock</div>}
      </div>
      <div className="card-content">
        <h3 className="sweet-name">{sweet.name}</h3>
        <p className="sweet-description">{sweet.description}</p>
        <div className="card-footer">
          <div className="price-stock">
            <span className="price">${sweet.price.toFixed(2)}</span>
            <span className="stock">Stock: {sweet.stock}</span>
          </div>
        </div>
        {sweet.stock > 0 && (
          <div className="quantity-selector">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="qty-btn"
              disabled={quantity === 1}
            >
              <Minus size={16} />
            </button>
            <span className="quantity">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(sweet.stock, quantity + 1))}
              className="qty-btn"
              disabled={quantity === sweet.stock}
            >
              <Plus size={16} />
            </button>
          </div>
        )}
        <button onClick={handleAddToCart} disabled={sweet.stock === 0 || loading} className="add-to-cart-btn">
          <ShoppingCart size={18} />
          {loading ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  )
}
