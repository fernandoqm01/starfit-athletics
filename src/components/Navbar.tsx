"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import CartDrawer from "./CartDrawer"
import { useCart } from "@/context/CartContext"
import { supabaseClient as supabase } from "@/lib/supabase-client"

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
    <header className="fixed top-0 left-0 right-0 z-40 bg-black/70 backdrop-blur-2xl shadow-[0_1px_30px_-10px_rgba(0,0,0,0.5)] transition-all duration-500">
      {/* Shine line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between relative z-10">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/20 group-hover:shadow-yellow-500/40 transition-shadow">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              STAR<span className="text-yellow-400">FIT</span>
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {[
            { href: "/products", label: "Productos" },
            { href: "/about", label: "Nosotros" },
            { href: "/contact", label: "Contacto" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-4 py-2 text-[13px] font-medium tracking-wide text-white/80 hover:text-yellow-500 transition rounded-lg hover:bg-white/5"
            >
              {label}
            </Link>
          ))}

          <div className="w-px h-5 bg-white/10 mx-2" />

          <Link
            href={user ? "/account" : "/login"}
            className="p-2 rounded-lg hover:bg-white/5 transition group"
            aria-label="Mi cuenta"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-[18px] w-[18px] text-white/80 group-hover:text-yellow-500 transition"
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
            className="relative p-2 rounded-lg hover:bg-white/5 transition group"
            aria-label="Abrir carrito"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-[18px] w-[18px] text-white/80 group-hover:text-yellow-500 transition"
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
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-black text-[10px] font-bold flex items-center justify-center shadow-lg">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        <div className="flex md:hidden items-center gap-1">
          <Link
            href={user ? "/account" : "/login"}
            className="p-2 rounded-lg hover:bg-white/5 transition group"
            aria-label="Mi cuenta"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-[18px] w-[18px] text-white/80 group-hover:text-yellow-500 transition"
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
            className="relative p-2 rounded-lg hover:bg-white/5 transition group"
            aria-label="Abrir carrito"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-[18px] w-[18px] text-white/80 group-hover:text-yellow-500 transition"
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
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-black text-[10px] font-bold flex items-center justify-center shadow-lg">
                {totalItems}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg hover:bg-white/5 transition group"
            aria-label="Abrir menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-[18px] w-[18px] text-white/80"
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
        <nav className="md:hidden relative z-10 border-t border-white/10 bg-black/80 backdrop-blur-2xl">
          <div className="px-6 py-5 flex flex-col gap-4 text-[15px]">
            {[
              { href: "/products", label: "Productos" },
              { href: "/about", label: "Nosotros" },
              { href: "/faq", label: "FAQ" },
              { href: "/track", label: "Seguir orden" },
              { href: "/contact", label: "Contacto" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-white/70 hover:text-yellow-500 transition py-1"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}

            <div className="w-full h-px bg-white/10" />

            <Link
              href={user ? "/account" : "/login"}
              className="text-white/70 hover:text-yellow-500 transition py-1"
              onClick={() => setMobileOpen(false)}
            >
              {user ? "Mi Cuenta" : "Iniciar Sesion"}
            </Link>
          </div>
        </nav>
      )}

      <CartDrawer open={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </header>
  )
}
