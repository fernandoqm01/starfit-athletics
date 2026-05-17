"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabaseClient as supabase } from "@/lib/supabase-client"
import { useNotification } from "@/context/NotificationContext"
import ConfirmModal from "@/components/ConfirmModal"

type ProductImage = {
  id: number
  url: string
  alt: string | null
  sort_order: number
}

type Product = {
  id: number
  name: string
  price: number
  image: string
  description: string | null
  category: string | null
  stock: number | null
  is_dropship: boolean
  supplier_name: string | null
  supplier_url: string | null
  est_delivery: string | null
  brand: string | null
  specifications: Record<string, string>[] | null
  features: string[] | null
  product_images?: ProductImage[]
}

const CATEGORIES = [
  "Ropa",
  "Calzado",
  "Accesorios",
  "Equipamiento",
  "Suplementos",
]

function parseSpecs(val: unknown): { key: string; value: string }[] {
  if (Array.isArray(val)) return val as { key: string; value: string }[]
  return []
}

function parseFeatures(val: unknown): string[] {
  if (Array.isArray(val)) return val as string[]
  return []
}

function sanitize(val: string): string {
  return val.replace(/<[^>]*>/g, "").trim()
}

export default function AdminPage() {
  const router = useRouter()
  const { notify } = useNotification()
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/login")
      } else {
        setIsAuthed(true)
      }
    })
  }, [router])

  const [products, setProducts] = useState<Product[]>([])
  const [editing, setEditing] = useState<Product | null>(null)

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [stock, setStock] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])

  const [isDropship, setIsDropship] = useState(false)
  const [supplierName, setSupplierName] = useState("")
  const [supplierUrl, setSupplierUrl] = useState("")
  const [estDelivery, setEstDelivery] = useState("")
  const [brand, setBrand] = useState("")
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }])
  const [features, setFeatures] = useState<string[]>([""])

  const [editIsDropship, setEditIsDropship] = useState(false)
  const [editSupplierName, setEditSupplierName] = useState("")
  const [editSupplierUrl, setEditSupplierUrl] = useState("")
  const [editEstDelivery, setEditEstDelivery] = useState("")
  const [editBrand, setEditBrand] = useState("")
  const [editSpecs, setEditSpecs] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }])
  const [editFeatures, setEditFeatures] = useState<string[]>([""])
  const [editImages, setEditImages] = useState<ProductImage[]>([])
  const [editImageFiles, setEditImageFiles] = useState<File[]>([])

  const [uploading, setUploading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)

  const uploadImage = async (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"]
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Formato de imagen no valido. Usa JPG, PNG, WebP o AVIF.")
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("La imagen no puede superar los 5MB.")
    }

    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`

    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, file)

    if (error) throw error

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const PAGE_SIZE = 20

  const fetchProducts = async (reset = false) => {
    const from = reset ? 0 : page * PAGE_SIZE
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false })
      .range(from, from + PAGE_SIZE - 1)

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
      specs: p.specifications || [],
      features: p.features || [],
      is_dropship: p.is_dropship ?? false,
      supplier_name: p.supplier_name || "",
      supplier_url: p.supplier_url || "",
      est_delivery: p.est_delivery || "",
      brand: p.brand || "",
    }))

    if (reset) {
      setProducts(cleanData)
      setPage(1)
    } else {
      setProducts((prev) => [...prev, ...cleanData])
      setPage((prev) => prev + 1)
    }

    setHasMore(cleanData.length === PAGE_SIZE)
  }

  useEffect(() => {
    fetchProducts(true)
  }, [])

  const resetForm = () => {
    setName("")
    setPrice("")
    setDescription("")
    setCategory("")
    setStock("")
    setImageFile(null)
    setImageFiles([])
    setIsDropship(false)
    setSupplierName("")
    setSupplierUrl("")
    setEstDelivery("")
    setBrand("")
    setSpecs([{ key: "", value: "" }])
    setFeatures([""])
  }

  const handleCreate = async () => {
    if (!name || !price) {
      notify("Completa al menos nombre y precio", "error")
      return
    }

    setUploading(true)

    try {
      let mainImage = ""

      // Upload main image
      if (imageFile) {
        mainImage = await uploadImage(imageFile)
      }

      // Insert product
      const { data: inserted, error } = await supabase
        .from("products")
        .insert([
          {
            name: sanitize(name),
            price: Number(price),
            image: mainImage,
            description: sanitize(description),
            category: category || null,
            stock: Number(stock) || 0,
            is_dropship: isDropship,
            supplier_name: isDropship ? sanitize(supplierName) : null,
            supplier_url: isDropship ? sanitize(supplierUrl) : null,
            est_delivery: isDropship ? sanitize(estDelivery) : null,
            brand: sanitize(brand) || null,
            specifications: specs.filter((s) => s.key && s.value),
            features: features.filter((f) => f.trim()),
          },
        ])
        .select()

      if (error) throw error

      const productId = inserted?.[0]?.id

      // Upload additional images
      if (productId && imageFiles.length > 0) {
        const imageRecords = []

        for (let i = 0; i < imageFiles.length; i++) {
          const url = await uploadImage(imageFiles[i])
          imageRecords.push({
            product_id: productId,
            url,
            alt: `${name} - imagen ${i + 2}`,
            sort_order: i + 1,
          })
        }

        if (imageRecords.length > 0) {
          const { error: imgErr } = await supabase
            .from("product_images")
            .insert(imageRecords)

          if (imgErr) console.error("Error saving additional images:", imgErr)
        }
      }

      notify("Producto creado", "success")
      resetForm()
      fetchProducts(true)
    } catch (error) {
      console.error(error)
      notify("Error al crear producto", "error")
    } finally {
      setUploading(false)
    }
  }

  const loadEditProduct = async (product: Product) => {
    setEditing(product)
    setEditIsDropship(product.is_dropship ?? false)
    setEditSupplierName(product.supplier_name || "")
    setEditSupplierUrl(product.supplier_url || "")
    setEditEstDelivery(product.est_delivery || "")
    setEditBrand(product.brand || "")

    const specsArr = parseSpecs(product.specifications)
    setEditSpecs(
      specsArr && specsArr.length > 0
        ? specsArr
        : [{ key: "", value: "" }]
    )

    const featArr = parseFeatures(product.features)
    setEditFeatures(
      featArr && featArr.length > 0 ? featArr : [""]
    )

    // Load images
    const { data: images } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", product.id)
      .order("sort_order", { ascending: true })

    setEditImages((images || []) as ProductImage[])
    setEditImageFiles([])
  }

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault()

    if (!editing) return

    setUploading(true)

    try {
      let image = editing.image

      // Upload new main image from edit files if selected
      if (editImageFiles.length > 0) {
        image = await uploadImage(editImageFiles[0])
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
          is_dropship: editIsDropship,
          supplier_name: editIsDropship ? sanitize(editSupplierName) : null,
          supplier_url: editIsDropship ? sanitize(editSupplierUrl) : null,
          est_delivery: editIsDropship ? sanitize(editEstDelivery) : null,
          brand: sanitize(editBrand) || null,
          specifications: editSpecs.filter((s) => s.key && s.value),
          features: editFeatures.filter((f) => f.trim()),
        })
        .eq("id", editing.id)

      if (error) throw error

      // Upload additional images from edit
      const remainingEditFiles = editImageFiles.slice(1)
      if (remainingEditFiles.length > 0) {
        const imageRecords = []

        for (let i = 0; i < remainingEditFiles.length; i++) {
          const url = await uploadImage(remainingEditFiles[i])
          imageRecords.push({
            product_id: editing.id,
            url,
            alt: `${editing.name} - imagen`,
            sort_order: editImages.length + i,
          })
        }

        if (imageRecords.length > 0) {
          const { error: imgErr } = await supabase
            .from("product_images")
            .insert(imageRecords)

          if (imgErr) console.error("Error saving additional images:", imgErr)
        }
      }

      notify("Producto actualizado", "success")
      setEditing(null)
      setEditImageFiles([])
      fetchProducts(true)
    } catch (error) {
      console.error(error)
      notify("Error al actualizar", "error")
    } finally {
      setUploading(false)
    }
  }

  const deleteProductImage = async (imageId: number) => {
    const { error } = await supabase
      .from("product_images")
      .delete()
      .eq("id", imageId)

    if (error) {
      notify("Error al eliminar imagen", "error")
      return
    }

    setEditImages((prev) => prev.filter((img) => img.id !== imageId))
  }

  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)

    if (error) {
      console.error(error)
      notify("Error al eliminar", "error")
      return
    }

    notify("Producto eliminado", "success")
    fetchProducts(true)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (!isAuthed) return null

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

        <div className="grid grid-cols-2 gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Selecciona categoria</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            placeholder="Marca"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <textarea
          placeholder="Descripcion"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-lg p-2"
        />

        {/* Dropshipping toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isDropship}
            onChange={(e) => setIsDropship(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="font-medium">Producto dropshipping</span>
        </label>

        {isDropship && (
          <div className="grid grid-cols-3 gap-3 pl-6">
            <input
              placeholder="Proveedor (ej: AliExpress)"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
            <input
              placeholder="URL del producto original"
              value={supplierUrl}
              onChange={(e) => setSupplierUrl(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
            <input
              placeholder="Tiempo de entrega"
              value={estDelivery}
              onChange={(e) => setEstDelivery(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
          </div>
        )}

        {/* Features */}
        <div>
          <label className="block text-sm font-semibold mb-2">Caracteristicas destacadas</label>
          {features.map((f, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                placeholder="Ej: Material premium"
                value={f}
                onChange={(e) => {
                  const next = [...features]
                  next[i] = e.target.value
                  setFeatures(next)
                }}
                className="flex-1 border rounded-lg p-2"
              />
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => setFeatures(features.filter((_, j) => j !== i))}
                  className="text-red-500 text-sm"
                >
                  Quitar
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFeatures([...features, ""])}
            className="text-sm text-blue-600 hover:underline"
          >
            + Agregar caracteristica
          </button>
        </div>

        {/* Specifications */}
        <div>
          <label className="block text-sm font-semibold mb-2">Especificaciones</label>
          {specs.map((s, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                placeholder="Clave (ej: Material)"
                value={s.key}
                onChange={(e) => {
                  const next = [...specs]
                  next[i] = { ...next[i], key: e.target.value }
                  setSpecs(next)
                }}
                className="w-1/3 border rounded-lg p-2"
              />
              <input
                placeholder="Valor (ej: Algodon 100%)"
                value={s.value}
                onChange={(e) => {
                  const next = [...specs]
                  next[i] = { ...next[i], value: e.target.value }
                  setSpecs(next)
                }}
                className="flex-1 border rounded-lg p-2"
              />
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => setSpecs(specs.filter((_, j) => j !== i))}
                  className="text-red-500 text-sm"
                >
                  Quitar
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setSpecs([...specs, { key: "", value: "" }])}
            className="text-sm text-blue-600 hover:underline"
          >
            + Agregar especificacion
          </button>
        </div>

        {/* Image upload */}
        <div>
          <label className="block text-sm font-semibold mb-2">Imagen principal</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Imagenes adicionales (puedes seleccionar varias)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              setImageFiles(e.target.files ? Array.from(e.target.files) : [])
            }
            className="w-full border rounded-lg p-2"
          />
        </div>

        <button
          onClick={handleCreate}
          disabled={uploading}
          className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {uploading ? "Subiendo..." : "Crear producto"}
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
                    <p className="font-semibold">
                      {p.name}
                      {p.is_dropship && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          Dropship
                        </span>
                      )}
                    </p>

                    <p className="text-sm text-gray-500">
                      ₡{p.price.toLocaleString()} · Stock: {stock}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => loadEditProduct(p)}
                    className="bg-black text-white px-3 py-1 rounded"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => setDeleteTarget(p.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )
          })
        )}

        {hasMore && (
          <button
            onClick={() => fetchProducts()}
            className="w-full py-3 text-sm font-medium text-gray-500 hover:text-black border border-dashed border-gray-300 rounded-xl transition"
          >
            Cargar mas productos
          </button>
        )}
      </div>

      {/* Modal Editar */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-10">
          <div className="fixed inset-0 bg-black/50" onClick={() => { setEditing(null); setEditImageFiles([]); setEditImages([]) }} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4 z-10">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">Editando: {editing.name}</h2>
              <button
                type="button"
                onClick={() => { setEditing(null); setEditImageFiles([]); setEditImages([]) }}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className="w-full border rounded-lg p-2"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={editing.price}
                  onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                  className="w-full border rounded-lg p-2"
                />
                <input
                  type="number"
                  value={editing.stock ?? 0}
                  onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={editing.category || ""}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">Selecciona categoria</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <input
                  placeholder="Marca"
                  value={editBrand}
                  onChange={(e) => setEditBrand(e.target.value)}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <textarea
                value={editing.description || ""}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                className="w-full border rounded-lg p-2"
              />

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={editIsDropship} onChange={(e) => setEditIsDropship(e.target.checked)} className="w-4 h-4" />
                <span className="font-medium">Producto dropshipping</span>
              </label>

              {editIsDropship && (
                <div className="grid grid-cols-3 gap-3 pl-6">
                  <input placeholder="Proveedor" value={editSupplierName} onChange={(e) => setEditSupplierName(e.target.value)} className="w-full border rounded-lg p-2" />
                  <input placeholder="URL del producto original" value={editSupplierUrl} onChange={(e) => setEditSupplierUrl(e.target.value)} className="w-full border rounded-lg p-2" />
                  <input placeholder="Tiempo de entrega" value={editEstDelivery} onChange={(e) => setEditEstDelivery(e.target.value)} className="w-full border rounded-lg p-2" />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2">Caracteristicas destacadas</label>
                {editFeatures.map((f, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input placeholder="Ej: Material premium" value={f} onChange={(e) => { const next = [...editFeatures]; next[i] = e.target.value; setEditFeatures(next) }} className="flex-1 border rounded-lg p-2" />
                    {i > 0 && <button type="button" onClick={() => setEditFeatures(editFeatures.filter((_, j) => j !== i))} className="text-red-500 text-sm">Quitar</button>}
                  </div>
                ))}
                <button type="button" onClick={() => setEditFeatures([...editFeatures, ""])} className="text-sm text-blue-600 hover:underline">+ Agregar caracteristica</button>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Especificaciones</label>
                {editSpecs.map((s, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input placeholder="Clave" value={s.key} onChange={(e) => { const next = [...editSpecs]; next[i] = { ...next[i], key: e.target.value }; setEditSpecs(next) }} className="w-1/3 border rounded-lg p-2" />
                    <input placeholder="Valor" value={s.value} onChange={(e) => { const next = [...editSpecs]; next[i] = { ...next[i], value: e.target.value }; setEditSpecs(next) }} className="flex-1 border rounded-lg p-2" />
                    {i > 0 && <button type="button" onClick={() => setEditSpecs(editSpecs.filter((_, j) => j !== i))} className="text-red-500 text-sm">Quitar</button>}
                  </div>
                ))}
                <button type="button" onClick={() => setEditSpecs([...editSpecs, { key: "", value: "" }])} className="text-sm text-blue-600 hover:underline">+ Agregar especificacion</button>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Imagenes del producto (la primera es la principal)</label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {editing.image && (
                    <div className="relative group">
                      <img src={editing.image} alt="Principal" className="w-24 h-24 object-cover rounded-lg border-2 border-black" />
                      <span className="absolute -top-2 -left-2 bg-black text-white text-[10px] px-1.5 py-0.5 rounded">1</span>
                    </div>
                  )}
                  {editImages.map((img) => (
                    <div key={img.id} className="relative group">
                      <img src={img.url} alt={img.alt || ""} className="w-24 h-24 object-cover rounded-lg border" />
                      <button type="button" onClick={() => deleteProductImage(img.id)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">x</button>
                      <span className="absolute -bottom-1 left-1 bg-black text-white text-[10px] px-1 py-0.5 rounded">{img.sort_order + 1}</span>
                    </div>
                  ))}
                </div>
                <input type="file" accept="image/*" multiple onChange={(e) => setEditImageFiles(e.target.files ? Array.from(e.target.files) : [])} className="w-full border rounded-lg p-2" />
              </div>

              <div className="flex gap-3">
                <button type="submit" disabled={uploading} className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">
                  {uploading ? "Guardando..." : "Guardar cambios"}
                </button>
                <button type="button" onClick={() => { setEditing(null); setEditImageFiles([]); setEditImages([]) }} className="bg-gray-300 px-4 py-2 rounded-lg">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={deleteTarget !== null}
        title="Eliminar producto"
        message="Esta accion no se puede deshacer."
        confirmLabel="Si, eliminar"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={() => { if (deleteTarget !== null) handleDelete(deleteTarget); setDeleteTarget(null) }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
