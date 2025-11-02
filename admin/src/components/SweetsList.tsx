"use client"

import { Trash2, Edit2 } from "lucide-react"
import { sweetsAPI } from "../api"
import "../styles/SweetsList.css"

interface Sweet {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  imageUrl: string
}

interface SweetsListProps {
  sweets: Sweet[]
  onEdit: (sweet: Sweet) => void
  onDelete: () => void
}

export default function SweetsList({ sweets, onEdit, onDelete }: SweetsListProps) {
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this sweet?")) {
      try {
        await sweetsAPI.delete(id)
        alert("Sweet deleted successfully")
        onDelete()
      } catch (error: any) {
        alert(error.response?.data?.message || "Error deleting sweet")
      }
    }
  }

  return (
    <div className="sweets-list">
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sweets.map((sweet) => (
            <tr key={sweet.id}>
              <td>
                <img src={sweet.imageUrl || "/placeholder.svg"} alt={sweet.name} />
              </td>
              <td>{sweet.name}</td>
              <td>{sweet.category}</td>
              <td>${sweet.price.toFixed(2)}</td>
              <td>
                <span className={`stock ${sweet.stock === 0 ? "out" : ""}`}>{sweet.stock}</span>
              </td>
              <td>
                <button className="edit-btn" onClick={() => onEdit(sweet)}>
                  <Edit2 size={18} />
                </button>
                <button className="delete-btn" onClick={() => handleDelete(sweet.id)}>
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
