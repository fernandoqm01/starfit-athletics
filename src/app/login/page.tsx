"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabaseClient as supabase } from "@/lib/supabase-client"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      if (isSignUp && password.length < 6) {
        setError("La contrasena debe tener al menos 6 caracteres")
        setLoading(false)
        return
      }

      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
        })

        if (error) throw error

        setSuccess("Cuenta creada. Ahora puedes iniciar sesion.")
        setIsSignUp(false)
        setPassword("")
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        })

        if (error) throw error

        router.refresh()
        setTimeout(() => router.push("/admin"), 100)
      }
    } catch (err: any) {
      const msg = err.message || "Ocurrio un error inesperado"
      if (msg.includes("Invalid login credentials")) {
        setError("Email o contrasena incorrectos")
      } else if (msg.includes("Email not confirmed")) {
        setError("Debes verificar tu email antes de iniciar sesion")
      } else if (msg.includes("already registered")) {
        setError("Este email ya esta registrado")
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">
          {isSignUp ? "Crear cuenta" : "Iniciar sesion"}
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contrasena"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-2 pr-16 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm hover:text-gray-600"
          >
            {showPassword ? "Ocultar" : "Ver"}
          </button>
        </div>

        {isSignUp && (
          <p className="text-xs text-gray-400">Minimo 6 caracteres</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? "Cargando..." : isSignUp ? "Registrarse" : "Entrar"}
        </button>

        <p className="text-center text-sm text-gray-500">
          {isSignUp ? "Ya tienes cuenta?" : "No tienes cuenta?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError("")
              setSuccess("")
              setPassword("")
            }}
            className="text-blue-600 hover:underline"
          >
            {isSignUp ? "Inicia sesion" : "Registrate"}
          </button>
        </p>
      </form>
    </div>
  )
}
