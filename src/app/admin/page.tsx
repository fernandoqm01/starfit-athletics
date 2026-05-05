"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabaseClient as supabase } from "@/lib/supabase-client"

type Product = {
  id: number
  name: string
  price: number
  image: string
  description: string | null
  category: string | null
  stock: number | null
}

const CATEGORIES = [
  "Ropa",
  "Calzado",
  "Accesorios",
  "Equipamiento",
  "Suplementos",
]

export default function AdminPage() {
  const router = useRouter()

  const [products, setProducts] = useState<Product[]>([])
  const [editing, setEditing] = useState<Product | null>(null)

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [stock, setStock] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)

  const [editImageFile, setEditImageFile] = useState<File | null>(null)

  const uploadImage = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`

    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, file)

    if (error) throw error

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false })

    if (error) {
      console.error(error)
      setProducts([])
      return
    }

    const cleanData = (data || []).map((p) => ({
      ...p,
      description: p.description || "",
      category: p.category || "",
      stock: p.stock ?? 0,
    }))

    setProducts(cleanData)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const resetForm = () => {
    setName("")
    setPrice("")
    setDescription("")
    setCategory("")
    setStock("")
    setImageFile(null)
  }

  const handleCreate = async () => {
    if (!name || !price) {
      alert("Completa al menos nombre y precio")
      return
    }

    let image = ""

    try {
      if (imageFile) {
        image = await uploadImage(imageFile)
      }

      const { error } = await supabase.from("products").insert([
        {
          name,
          price: Number(price),
          image,
          description,
          category,
          stock: Number(stock) || 0,
        },
      ])

      if (error) throw error

      alert("Producto creado")
      resetForm()
      fetchProducts()
    } catch (error) {
      console.error(error)
      alert("Error al crear producto")
    }
  }

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault()

    if (!editing) return

    try {
      let image = editing.image

      if (editImageFile) {
        image = await uploadImage(editImageFile)
      }

      const { error } = await supabase
        .from("products")
        .update({
          name: editing.name,
          price: editing.price,
          image,
          description: editing.description,
          category: editing.category,
          stock: editing.stock,
        })
        .eq("id", editing.id)

      if (error) throw error

      alert("Producto actualizado")
      setEditing(null)
      setEditImageFile(null)
      fetchProducts()
    } catch (error) {
      console.error(error)
      alert("Error al actualizar")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar producto?")) return

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)

    if (error) {
      console.error(error)
      alert("Error al eliminar")
      return
    }

    alert("Producto eliminado")
    fetchProducts()
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Panel Admin</h1>
          <Link
            href="/admin/orders"
            className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition"
          >
            Ver ordenes
          </Link>
        </div>

        <button
          onClick={handleSignOut}
          className="text-sm text-red-500 hover:underline"
        >
          Cerrar sesion
        </button>
      </div>

      {/* Crear */}
      <div className="p-5 border rounded-xl space-y-4">
        <h2 className="font-semibold text-lg">Crear producto</h2>

        <input
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-lg p-2"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Precio"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded-lg p-2"
          />

          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded-lg p-2"
        >
          <option value="">Selecciona categoría</option>

          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-lg p-2"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="w-full border rounded-lg p-2"
        />

        <button
          onClick={handleCreate}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Crear producto
        </button>
      </div>

      {/* Lista */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Productos</h2>

        {products.length === 0 ? (
          <p className="text-gray-500">No hay productos</p>
        ) : (
          products.map((p) => {
            const stock = p.stock ?? 0

            return (
              <div
                key={p.id}
                className="flex justify-between items-center border rounded-xl p-3"
              >
                <div className="flex items-center gap-3">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-200" />
                  )}

                  <div>
                    <p className="font-semibold">{p.name}</p>

                    <p className="text-sm text-gray-500">
                      ₡{p.price.toLocaleString()} · Stock: {stock}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(p)}
                    className="bg-black text-white px-3 py-1 rounded"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Editar */}
      {editing && (
        <form
          onSubmit={handleUpdate}
          className="p-5 border rounded-xl space-y-4"
        >
          <h2 className="font-semibold text-lg">
            Editando: {editing.name}
          </h2>

          <input
            value={editing.name}
            onChange={(e) =>
              setEditing({ ...editing, name: e.target.value })
            }
            className="w-full border rounded-lg p-2"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              value={editing.price}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  price: Number(e.target.value),
                })
              }
              className="w-full border rounded-lg p-2"
            />

            <input
              type="number"
              value={editing.stock ?? 0}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  stock: Number(e.target.value),
                })
              }
              className="w-full border rounded-lg p-2"
            />
          </div>

          <select
            value={editing.category || ""}
            onChange={(e) =>
              setEditing({
                ...editing,
                category: e.target.value,
              })
            }
            className="w-full border rounded-lg p-2"
          >
            <option value="">Selecciona categoría</option>

            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <textarea
            value={editing.description || ""}
            onChange={(e) =>
              setEditing({
                ...editing,
                description: e.target.value,
              })
            }
            className="w-full border rounded-lg p-2"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setEditImageFile(e.target.files?.[0] || null)
            }
            className="w-full border rounded-lg p-2"
          />

          {editing.image && (
            <img
              src={editing.image}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg"
            />
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Guardar cambios
            </button>

            <button
              type="button"
              onClick={() => {
                setEditing(null)
                setEditImageFile(null)
              }}
              className="bg-gray-300 px-4 py-2 rounded-lg"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  )
}