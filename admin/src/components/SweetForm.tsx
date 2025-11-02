"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { sweetsAPI } from "../api"
import "../styles/SweetForm.css"

interface Sweet {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  imageUrl: string
}

interface SweetFormProps {
  sweet?: Sweet | null
  onSave: () => void
  onCancel: () => void
}

export default function SweetForm({ sweet, onSave, onCancel }: SweetFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    imageUrl: "",
  })
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState("")

  useEffect(() => {
    if (sweet) {
      setFormData({
        name: sweet.name,
        description: sweet.description,
        price: sweet.price.toString(),
        stock: sweet.stock.toString(),
        category: sweet.category,
        imageUrl: sweet.imageUrl,
      })
      setImagePreview(sweet.imageUrl)
    }
  }, [sweet])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "imageUrl") {
      setImagePreview(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const dataToSend = {
        ...formData,
        price: Number.parseFloat(formData.price),
        stock: Number.parseInt(formData.stock),
      }

      if (sweet?.id) {
        await sweetsAPI.update(sweet.id, dataToSend)
        alert("Sweet updated successfully")
      } else {
        await sweetsAPI.create(dataToSend)
        alert("Sweet added successfully")
      }
      onSave()
    } catch (error: any) {
      alert(error.response?.data?.message || "Error saving sweet")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="sweet-form">
      <h3>{sweet ? "Edit Sweet" : "Add New Sweet"}</h3>

      {imagePreview && (
        <div className="image-preview">
          <img src={imagePreview || "/placeholder.svg"} alt="Preview" />
          <p>Image Preview</p>
        </div>
      )}

      <input
        type="text"
        name="name"
        placeholder="Sweet Name *"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Description (e.g., Delicious chocolate fudge with almond pieces)"
        value={formData.description}
        onChange={handleChange}
        rows={3}
      />

      <input
        type="number"
        name="price"
        placeholder="Price ($) *"
        value={formData.price}
        onChange={handleChange}
        step="0.01"
        min="0"
        required
      />

      <input
        type="number"
        name="stock"
        placeholder="Stock Quantity *"
        value={formData.stock}
        onChange={handleChange}
        min="0"
        required
      />

      <input
        type="text"
        name="category"
        placeholder="Category (e.g., Chocolate, Gummies, Hard Candy) *"
        value={formData.category}
        onChange={handleChange}
        required
      />

      <input
        type="url"
        name="imageUrl"
        placeholder="Image URL (paste full image URL here) *"
        value={formData.imageUrl}
        onChange={handleChange}
        required
      />

      <div className="form-buttons">
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : sweet ? "Update Sweet" : "Add Sweet"}
        </button>
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
      </div>
    </form>
  )
}
