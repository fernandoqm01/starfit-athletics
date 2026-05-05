"use client"

import { createContext, useContext, useState, useEffect } from "react"

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
  notification: string | null
  clearCart: () => void
  totalItems: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [notification, setNotification] = useState<string | null>(null)

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

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 2000)
      return () => clearTimeout(timer)
    }
  }, [notification])

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
      ? `${product.name} (Talla ${product.size}) agregado al carrito`
      : `${product.name} agregado al carrito`
    setNotification(msg)
  }

  const removeFromCart = (id: number, size?: string) => {
    setCart((prev) =>
      size
        ? prev.filter((item) => !(item.id === id && item.size === size))
        : prev.filter((item) => item.id !== id)
    )
    setNotification("Producto eliminado del carrito")
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
    setNotification("Carrito vaciado")
  }

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        notification,
        clearCart,
        totalItems,
      }}
    >
      {children}
      {notification && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-black text-white px-6 py-3 rounded-xl shadow-lg text-sm animate-fade-in">
          {notification}
        </div>
      )}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within CartProvider")
  return context
}
