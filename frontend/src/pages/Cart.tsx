"use client"

import { useState, useEffect } from "react"
import { cartAPI, ordersAPI } from "../api"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import "./Cart.css"

interface CartItem {
  id: string
  quantity: number
  sweet: {
    id: string
    name: string
    price: number
    stock: number
    imageUrl: string
  }
}

interface Cart {
  items: CartItem[]
}

export default function Cart() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const response = await cartAPI.getCart()
      setCart(response.data.payload)
    } catch (error) {
      console.error("Error fetching cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      await cartAPI.updateCartItem(itemId, { quantity: newQuantity })
      fetchCart()
    } catch (error) {
      console.error("Error updating quantity:", error)
      alert("Failed to update quantity")
    }
  }

  const handleRemove = async (itemId: string) => {
    try {
      await cartAPI.removeFromCart(itemId)
      fetchCart()
    } catch (error) {
      console.error("Error removing item:", error)
      alert("Failed to remove item")
    }
  }

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true)
      const response = await ordersAPI.create()
      alert("Order placed successfully!")
      localStorage.setItem("cartCount", "0")
      setCart(null)
      window.location.href = "/orders"
    } catch (error: any) {
      alert(error.response?.data?.message || "Error placing order")
    } finally {
      setCheckoutLoading(false)
    }
  }

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your cart...</p>
      </div>
    )

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-empty">
        <ShoppingBag size={80} className="empty-icon" />
        <h2>Your cart is empty</h2>
        <p>Start shopping to add items to your cart!</p>
        <a href="/" className="continue-shopping">
          Continue Shopping
        </a>
      </div>
    )
  }

  const total = cart.items.reduce((sum, item) => sum + item.sweet.price * item.quantity, 0)
  const tax = total * 0.1
  const finalTotal = total + tax

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <span className="item-count">{cart.items.length} item(s)</span>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cart.items.map((item, index) => (
            <div key={item.id} className="cart-item" style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="item-image-wrapper">
                <img src={item.sweet.imageUrl || "/placeholder.svg"} alt={item.sweet.name} className="item-image" />
              </div>

              <div className="item-details">
                <h3>{item.sweet.name}</h3>
                <p className="item-price">${item.sweet.price.toFixed(2)} per item</p>
              </div>

              <div className="item-quantity">
                <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity === 1}>
                  <Minus size={18} />
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.sweet.stock}
                >
                  <Plus size={18} />
                </button>
              </div>

              <div className="item-total">${(item.sweet.price * item.quantity).toFixed(2)}</div>

              <button className="remove-btn" onClick={() => handleRemove(item.id)} title="Remove from cart">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-divider"></div>

          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Tax (10%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <div className="summary-row total-row">
            <span>Total:</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>

          <button className="checkout-btn" onClick={handleCheckout} disabled={checkoutLoading}>
            {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
          </button>

          <a href="/" className="continue-shopping-link">
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
  )
}
