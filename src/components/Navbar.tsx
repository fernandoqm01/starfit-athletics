"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import CartDrawer from "./CartDrawer"
import { useCart } from "@/context/CartContext"
import { supabaseClient as supabase } from "@/lib/supabase-client"
import CookieBanner from "./CookieBanner"

export default function Navbar() {
  const { totalItems } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) =>
      setUser(session?.user ?? null)
    )
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all ${
        scrolled
          ? "bg-black/80 backdrop-blur-md shadow-lg"
          : "bg-gradient-to-b from-black/50 to-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="StarFit"
            width={110}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-7">
          <Link
            href="/products"
            className="text-[13px] font-medium tracking-wide text-white/90 hover:text-yellow-500 transition"
          >
            Productos
          </Link>

          <Link
            href="/about"
            className="text-[13px] font-medium tracking-wide text-white/90 hover:text-yellow-500 transition"
          >
            Nosotros
          </Link>

          <Link
            href="/contact"
            className="text-[13px] font-medium tracking-wide text-white/90 hover:text-yellow-500 transition"
          >
            Contacto
          </Link>

          <Link
            href={user ? "/account" : "/login"}
            className="p-2 rounded-full hover:bg-white/5 transition group"
            aria-label="Mi cuenta"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-[18px] w-[18px] text-white group-hover:text-yellow-500 transition"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0
                00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </Link>

          <button
            onClick={() => setCartDrawerOpen(true)}
            className="relative p-2 rounded-full hover:bg-white/5 transition group"
            aria-label="Abrir carrito"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-[18px] w-[18px] text-white group-hover:text-yellow-500 transition"
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
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-yellow-500 text-black text-[10px] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <Link
            href={user ? "/account" : "/login"}
            className="p-2 group"
            aria-label="Mi cuenta"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-[18px] w-[18px] text-white group-hover:text-yellow-500 transition"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0
                00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </Link>

          <button
            onClick={() => setCartDrawerOpen(true)}
            className="relative p-2 group"
            aria-label="Abrir carrito"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-[18px] w-[18px] text-white group-hover:text-yellow-500 transition"
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
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-yellow-500 text-black text-[10px] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-white"
            aria-label="Abrir menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-[18px] w-[18px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-white/10 bg-black/80 backdrop-blur-md">
          <div className="px-6 py-5 flex flex-col gap-5 text-[15px]">
            <Link
              href="/products"
              className="text-white/80 hover:text-yellow-500 transition"
              onClick={() => setMobileOpen(false)}
            >
              Productos
            </Link>

            <Link
              href="/about"
              className="text-white/80 hover:text-yellow-500 transition"
              onClick={() => setMobileOpen(false)}
            >
              Nosotros
            </Link>

            <Link
              href="/contact"
              className="text-white/80 hover:text-yellow-500 transition"
              onClick={() => setMobileOpen(false)}
            >
              Contacto
            </Link>

            <Link
              href={user ? "/account" : "/login"}
              className="text-white/80 hover:text-yellow-500 transition"
              onClick={() => setMobileOpen(false)}
            >
              {user ? "Mi Cuenta" : "Iniciar Sesion"}
            </Link>
          </div>
        </nav>
      )}

      <CartDrawer open={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
      <CookieBanner />
    </header>
  )
}