"use client"

import { useState, useEffect } from "react"
import { ordersAPI } from "../api"
import "./Orders.css"

interface OrderItem {
  id: string
  quantity: number
  price: number
  sweet: {
    id: string
    name: string
  }
}

interface Order {
  id: string
  total: number
  status: string
  createdAt: string
  items: OrderItem[]
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 10

  useEffect(() => {
    fetchOrders()
  }, [page])

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getAll(page, limit)
      setOrders(response.data.payload.orders)
      setTotal(response.data.payload.pagination.total)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading orders...</div>
  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <h2>No orders yet</h2>
        <a href="/" className="shop-link">
          Start Shopping
        </a>
      </div>
    )
  }

  const pages = Math.ceil(total / limit)

  return (
    <div className="orders-container">
      <h1>My Orders</h1>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div>
                <h3>Order #{order.id.slice(-8).toUpperCase()}</h3>
                <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="order-meta">
                <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
                <p className="order-total">${order.total.toFixed(2)}</p>
              </div>
            </div>
            <div className="order-items">
              {order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <span>
                    {item.sweet.name} x {item.quantity}
                  </span>
                  <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {pages > 1 && (
        <div className="pagination">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Previous
          </button>
          <span>
            Page {page} of {pages}
          </span>
          <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}>
            Next
          </button>
        </div>
      )}
    </div>
  )
}
