"use client"

import { useEffect, useState, useCallback } from "react"
import { supabaseClient as supabase } from "@/lib/supabase-client"
import Link from "next/link"
import Image from "next/image"

type Product = {
  id: number
  name: string
  price: number
  image: string
  category: string | null
  stock: number | null
  is_dropship: boolean
}

const CATEGORIES = [
  "Todos",
  "Ropa",
  "Calzado",
  "Accesorios",
  "Equipamiento",
  "Suplementos",
]

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("Todos")
  const [sort, setSort] = useState("default")
  const [maxPrice, setMaxPrice] = useState<number | null>(null)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [dropshipOnly, setDropshipOnly] = useState(false)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await supabase.from("products").select("*")
      setProducts((data || []) as Product[])
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const filtered = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => category === "Todos" || p.category === category)
    .filter((p) => (inStockOnly ? (p.stock ?? 0) > 0 : true))
    .filter((p) => (dropshipOnly ? p.is_dropship : true))
    .filter((p) => (maxPrice ? p.price <= maxPrice : true))
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price
      if (sort === "price-desc") return b.price - a.price
      if (sort === "name") return a.name.localeCompare(b.name)
      return 0
    })

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Productos</h1>

      {/* Busqueda y filtros */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-black"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-black bg-white"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-black bg-white"
        >
          <option value="default">Ordenar</option>
          <option value="price-asc">Menor precio</option>
          <option value="price-desc">Mayor precio</option>
          <option value="name">Nombre A-Z</option>
        </select>

        <input
          type="number"
          placeholder="Precio max"
          value={maxPrice ?? ""}
          onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)}
          className="w-28 border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-black"
        />

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 whitespace-nowrap cursor-pointer">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">En stock</span>
          </label>

          <label className="flex items-center gap-2 whitespace-nowrap cursor-pointer">
            <input
              type="checkbox"
              checked={dropshipOnly}
              onChange={(e) => setDropshipOnly(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Dropshipping</span>
          </label>
        </div>
      </div>

      {/* Resultados */}
      <p className="text-sm text-gray-500 mb-6">
        {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
      </p>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow space-y-3">
              <div className="h-40 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 animate-slide-in-up">
          <svg className="w-20 h-20 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <p className="text-gray-500 text-lg font-medium mb-2">No se encontraron productos</p>
          <p className="text-gray-400 text-sm mb-4">Intenta cambiar los filtros de busqueda</p>
          <button
            onClick={() => {
              setSearch("")
              setCategory("Todos")
              setSort("default")
              setMaxPrice(null)
              setInStockOnly(false)
              setDropshipOnly(false)
            }}
            className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {filtered.map((p, idx) => {
            const stock = p.stock ?? 0
            const isLowStock = stock > 0 && stock <= 5
            const isOutOfStock = stock === 0

            return (
              <Link
                href={`/products/${p.id}`}
                key={p.id}
                className={`group ${isOutOfStock ? "opacity-50 pointer-events-none" : ""} animate-scale-in`}
                style={{ animationDelay: `${idx * 50}ms`, animationFillMode: "both" }}
              >
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden will-change-transform hover:-translate-y-1.5">
                  <div className="relative overflow-hidden">
                    {p.image && p.image.startsWith("http") ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-44 w-full object-cover bg-gray-100 transition-all duration-500 ease-out group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-44 w-full bg-gray-100" />
                    )}

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* View button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <span className="bg-white text-black text-xs font-semibold px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
                        Ver producto
                      </span>
                    </div>

                    {/* Shimmer on hover */}
                    <div className="absolute inset-0 card-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Badges */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      {p.is_dropship && (
                        <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                          Envio directo
                        </span>
                      )}
                    </div>

                    {isOutOfStock && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-medium">
                        Agotado
                      </div>
                    )}

                    {isLowStock && (
                      <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded font-medium">
                        Solo {stock}
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    {p.category && (
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                        {p.category}
                      </span>
                    )}
                    <h3 className="font-semibold text-sm truncate mt-0.5 group-hover:text-black transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-gray-900 text-sm font-bold mt-1.5 group-hover:scale-105 inline-block transition-transform origin-left">
                      ₡{p.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
