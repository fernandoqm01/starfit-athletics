"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/context/CartContext"
import CartDrawer from "./CartDrawer"

export default function Navbar() {
  const { cart } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/5">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl h-px bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />

        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
               src="/logo.svg"
              alt="StarFit"
              width={108}
              height={30}
              className="h-7 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-7">
            <Link
              href="/products"
              className="text-[13px] font-medium tracking-wide text-white/90 hover:text-white transition"
            >
              Productos
            </Link>

            <Link
              href="/about"
              className="text-[13px] font-medium tracking-wide text-white/90 hover:text-white transition"
            >
              Nosotros
            </Link>

            <Link
              href="/contact"
              className="text-[13px] font-medium tracking-wide text-white/90 hover:text-white transition"
            >
              Contacto
            </Link>

            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative p-2 rounded-full hover:bg-white/5 transition"
              aria-label="Abrir carrito"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-[18px] w-[18px] text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293
                  2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100
                  4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>

              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative p-2"
              aria-label="Abrir carrito"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-[18px] w-[18px] text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293
                  2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100
                  4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>

              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-white"
              aria-label="Abrir menú"
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-black border-t border-white/5 px-5 py-4 space-y-3">
            <Link
              href="/products"
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-white/90 hover:text-white"
            >
              Productos
            </Link>

            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-white/90 hover:text-white"
            >
              Nosotros
            </Link>

            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-white/90 hover:text-white"
            >
              Contacto
            </Link>
          </div>
        )}
      </nav>

      <CartDrawer
        open={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
      />
    </>
  )
}