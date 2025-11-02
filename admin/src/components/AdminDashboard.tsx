"use client"

import { useState, useEffect } from "react"
import { sweetsAPI } from "../api"
import SweetForm from "./SweetForm"
import SweetsList from "./SweetsList"
import "../styles/AdminDashboard.css"
import { Plus, LogOut } from "lucide-react"

interface Sweet {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  imageUrl: string
}

interface AdminDashboardProps {
  onLogout: () => void
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [sweets, setSweets] = useState<Sweet[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const limit = 10

  useEffect(() => {
    fetchSweets()
  }, [page])

  const fetchSweets = async () => {
    try {
      setLoading(true)
      const response = await sweetsAPI.getAll(page, limit)
      setSweets(response.data.payload.sweets)
      setTotal(response.data.payload.pagination.total)
    } catch (error) {
      console.error("Error fetching sweets:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSweetSaved = () => {
    setShowForm(false)
    setEditingSweet(null)
    setPage(1)
    fetchSweets()
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminUser")
    onLogout()
  }

  const pages = Math.ceil(total / limit)

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>🍬 Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={20} />
          Logout
        </button>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-controls">
          <h2>Manage Sweets</h2>
          <button
            onClick={() => {
              setEditingSweet(null)
              setShowForm(!showForm)
            }}
            className="add-btn"
          >
            <Plus size={20} />
            {showForm ? "Cancel" : "Add New Sweet"}
          </button>
        </div>

        {showForm && (
          <SweetForm
            sweet={editingSweet}
            onSave={handleSweetSaved}
            onCancel={() => {
              setShowForm(false)
              setEditingSweet(null)
            }}
          />
        )}

        {loading ? (
          <div className="loading">Loading sweets...</div>
        ) : (
          <>
            <SweetsList
              sweets={sweets}
              onEdit={(sweet: Sweet) => {
                setEditingSweet(sweet)
                setShowForm(true)
              }}
              onDelete={() => fetchSweets()}
            />
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
          </>
        )}
      </div>
    </div>
  )
}
