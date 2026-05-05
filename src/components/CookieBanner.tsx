"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem("cookies-accepted")
    if (!accepted) {
      setVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookies-accepted", "true")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50 animate-slide-in-up">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600 text-center md:text-left">
          Usamos cookies para mejorar tu experiencia. Al continuar, aceptas nuestra{" "}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            politica de privacidad
          </Link>
          .
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setVisible(false)}
            className="text-sm text-gray-500 hover:text-gray-700 transition px-4 py-2"
          >
            Rechazar
          </button>
          <button
            onClick={handleAccept}
            className="bg-black text-white text-sm px-6 py-2 rounded-lg hover:bg-gray-800 transition font-medium"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}
