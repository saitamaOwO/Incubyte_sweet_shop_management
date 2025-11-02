"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { sweetsAPI } from "../api"
import SweetCard from "../components/SweetCard"
import "./Home.css"

interface Sweet {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  imageUrl: string
}

export default function Home() {
  const [sweets, setSweets] = useState<Sweet[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (searchQuery.trim()) {
        const response = await sweetsAPI.search(searchQuery)
        setSweets(response.data.payload)
        setPage(1)
      } else {
        fetchSweets()
      }
    } catch (error) {
      console.error("Error searching:", error)
    }
  }

  const pages = Math.ceil(total / limit)

  return (
    <div className="home">
      <div className="search-container">
        <h1 className="hero-title">Welcome to Sweet Shop</h1>
        <p className="hero-subtitle">Discover the finest selection of premium sweets and candies</p>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search sweets by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading sweets...</p>
        </div>
      ) : (
        <>
          <div className="sweets-grid">
            {sweets.length > 0 ? (
              sweets.map((sweet: Sweet, index: number) => (
                <div key={sweet.id} className="grid-item" style={{ animationDelay: `${index * 0.05}s` }}>
                  <SweetCard sweet={sweet} onAddSuccess={fetchSweets} />
                </div>
              ))
            ) : (
              <p className="no-results">No sweets found. Try a different search!</p>
            )}
          </div>

          {pages > 1 && (
            <div className="pagination">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                Previous
              </button>
              <span className="page-info">
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
  )
}
