import { useState } from 'react'
import { SIZES } from '@/data/menu'

export function useCart() {
  const [items, setItems] = useState([])

  const addItem = (pizza, size) => {
    const key = `${pizza.id}-${size}`
    setItems(prev => {
      const existing = prev.find(i => i.key === key)
      if (existing) return prev.map(i => i.key === key ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { key, pizza, size, qty: 1 }]
    })
  }

  const removeItem = (key) => setItems(prev => prev.filter(i => i.key !== key))

  const updateQty = (key, qty) => {
    if (qty <= 0) return removeItem(key)
    setItems(prev => prev.map(i => i.key === key ? { ...i, qty } : i))
  }

  const clearCart = () => setItems([])

  const total = items.reduce((sum, i) => sum + SIZES[i.size].price * i.qty, 0)
  const count = items.reduce((sum, i) => sum + i.qty, 0)

  return { items, addItem, removeItem, updateQty, clearCart, total, count }
}
