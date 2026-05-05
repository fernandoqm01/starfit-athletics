"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold mb-4">Algo salió mal</h1>
        <p className="text-gray-600 mb-6">Ha ocurrido un error inesperado.</p>
        <button
          onClick={reset}
          className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  )
}
