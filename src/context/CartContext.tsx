"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useNotification } from "./NotificationContext"

type Product = {
  id: number
  name: string
  price: number
  image?: string
  size?: string
}

type CartItem = Product & {
  quantity: number
}

type CartContextType = {
  cart: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (id: number, size?: string) => void
  decreaseQuantity: (id: number, size: string) => void
  clearCart: () => void
  totalItems: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const { notify } = useNotification()

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) setCart(JSON.parse(savedCart))
    } catch {
      console.error("Failed to parse cart from localStorage")
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id && item.size === product.size
      )

      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.size === product.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...prev, { ...product, quantity: 1 }]
    })
    const msg = product.size
      ? `${product.name} (Talla ${product.size}) agregado`
      : `${product.name} agregado`
    notify(msg)
  }

  const removeFromCart = (id: number, size?: string) => {
    setCart((prev) =>
      size
        ? prev.filter((item) => !(item.id === id && item.size === size))
        : prev.filter((item) => item.id !== id)
    )
    notify("Producto eliminado", "error")
  }

  const decreaseQuantity = (id: number, size: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id && item.size === size
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const clearCart = () => {
    setCart([])
    notify("Carrito vaciado", "error")
  }

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        clearCart,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within CartProvider")
  return context
}
