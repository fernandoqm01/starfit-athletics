"use client"

import { useEffect, useState, use } from "react"
import { supabaseClient as supabase } from "@/lib/supabase-client"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/CartContext"

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
  description?: string
  category: string | null
  stock: number | null
  is_dropship: boolean
  supplier_name: string | null
  supplier_url: string | null
  est_delivery: string | null
  brand: string | null
  specifications: { key: string; value: string }[] | null
  features: string[] | null
}

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"]

const TABS = ["Descripcion", "Caracteristicas", "Especificaciones", "Envio"]

function parseSpecs(val: unknown): { key: string; value: string }[] {
  if (Array.isArray(val)) return val as { key: string; value: string }[]
  return []
}

function parseFeatures(val: unknown): string[] {
  if (Array.isArray(val)) return val as string[]
  return []
}

export default function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { addToCart } = useCart()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [sizeError, setSizeError] = useState(false)
  const [images, setImages] = useState<ProductImage[]>([])
  const [selectedImage, setSelectedImage] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(0)

  const allImages = [
    ...(product?.image ? [{ id: 0, url: product.image, alt: product.name, sort_order: 0 }] : []),
    ...images,
  ]

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single()

      if (error) {
        console.error(error)
      } else {
        setProduct(data)

        try {
          const { data: productImages } = await supabase
            .from("product_images")
            .select("*")
            .eq("product_id", id)
            .order("sort_order", { ascending: true })

          setImages((productImages || []) as ProductImage[])
        } catch {
          setImages([])
        }

        if (data?.category) {
          const { data: relatedData } = await supabase
            .from("products")
            .select("*")
            .eq("category", data.category)
            .neq("id", id)
            .limit(4)
          setRelated(relatedData || [])
        }
      }
    }

    if (id) fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    if ((product.stock ?? 0) === 0) return

    if (!selectedSize) {
      setSizeError(true)
      return
    }
    setSizeError(false)
    addToCart({ ...product, size: selectedSize, stock: product.stock ?? 0 })
  }

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
  }

  if (!product) return <p className="p-6">Cargando...</p>

  const stock = product.stock ?? 0
  const isLowStock = stock > 0 && stock <= 5
  const isOutOfStock = stock === 0
  const specs = parseSpecs(product.specifications)
  const features = parseFeatures(product.features)

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumbs */}
      <div className="px-6 pt-4 pb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-black transition">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-black transition">
            Productos
          </Link>
          <span>/</span>
          <span className="text-black truncate">{product.name}</span>
        </div>
      </div>

      {/* Back button */}
      <div className="px-6 pb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>
      </div>

      {/* Product */}
      <div className="px-6 pb-16 grid md:grid-cols-2 gap-10">
        {/* Galeria */}
        <div>
          {allImages.length > 0 ? (
            <>
              <div className="relative">
                {allImages[selectedImage]?.url?.startsWith("http") ? (
                  <img
                    src={allImages[selectedImage].url}
                    alt={allImages[selectedImage].alt || product.name}
                    className="w-full h-[400px] object-cover rounded-xl bg-gray-100 cursor-pointer"
                    onClick={() => setLightboxOpen(true)}
                  />
                ) : (
                  <div className="w-full h-[400px] bg-gray-100 rounded-xl flex items-center justify-center">
                    <span className="text-gray-400">Sin imagen</span>
                  </div>
                )}

                {product.category && (
                  <span className="absolute top-4 left-4 bg-black text-white text-xs px-3 py-1 rounded-full uppercase tracking-wide">
                    {product.category}
                  </span>
                )}

                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition shadow"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition shadow"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                  {allImages.map((img, i) => (
                    <button
                      key={img.id || i}
                      onClick={() => setSelectedImage(i)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                        i === selectedImage ? "border-black" : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.alt || ""}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-[400px] bg-gray-100 rounded-xl flex items-center justify-center">
              <span className="text-gray-400">Sin imagen</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.brand && (
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
              {product.brand}
            </p>
          )}

          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <p className="text-2xl font-semibold mb-4">{product.price.toLocaleString()}</p>

          {/* Stock indicator */}
          {isOutOfStock ? (
            <div className="flex items-center gap-2 text-red-500 font-semibold mb-4">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              Agotado
            </div>
          ) : isLowStock ? (
            <div className="flex items-center gap-2 text-orange-500 font-semibold mb-4">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              Solo quedan {stock}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-600 font-semibold mb-4">
              <div className="w-2 h-2 bg-green-600 rounded-full" />
              En stock
            </div>
          )}

          {/* Dropshipping badge */}
          {product.is_dropship && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                <span className="font-semibold text-sm text-blue-700">Envio directo del proveedor</span>
              </div>
              {product.supplier_name && (
                <p className="text-xs text-blue-600">Proveedor: {product.supplier_name}</p>
              )}
              {product.est_delivery && (
                <p className="text-xs text-blue-600">Tiempo estimado: {product.est_delivery}</p>
              )}
              {product.supplier_url && (
                <a
                  href={product.supplier_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 underline mt-1 inline-block"
                >
                  Ver producto en tienda original
                </a>
              )}
            </div>
          )}

          {/* Tallas */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Selecciona tu talla:</h3>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedSize(size)
                    setSizeError(false)
                  }}
                  className={`min-w-[52px] px-4 py-3 border-2 rounded-lg font-medium text-sm transition ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {sizeError && (
              <p className="text-red-500 text-sm mt-2">
                Debes seleccionar una talla
              </p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full px-6 py-4 rounded-xl font-semibold text-lg transition ${
              isOutOfStock
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800 active:scale-[0.98]"
            }`}
          >
            {isOutOfStock ? "Sin stock" : "Agregar al carrito"}
          </button>

          {/* Trust badges */}
          <div className="mt-6 grid grid-cols-3 gap-4 text-center text-xs text-gray-500">
            <div className="p-3 bg-gray-50 rounded-lg">
              <svg className="w-5 h-5 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              Envio gratis
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <svg className="w-5 h-5 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-.001 9.984l2.929-2.929m0 0l-2.929-2.929m0 0l-2.929 2.929m0 0l2.929 2.929M3.524 4.356h4.992V9.348M21.015 4.356v4.992m-4.992 0h4.992m0 0l2.929-2.929m0 0l-2.929-2.929m0 0l-2.929 2.929m0 0l2.929 2.929" />
              </svg>
              Devoluciones gratis
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <svg className="w-5 h-5 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              Pago seguro
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t px-6 pt-8 pb-16">
        <div className="flex border-b mb-8 overflow-x-auto">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-6 pb-3 text-sm font-medium transition whitespace-nowrap ${
                activeTab === i
                  ? "text-black border-b-2 border-black"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="max-w-3xl">
          {activeTab === 0 && (
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-600 leading-relaxed">
                {product.description || "No hay descripcion disponible para este producto."}
              </p>
            </div>
          )}

          {activeTab === 1 && (
            <div>
              {features && features.length > 0 ? (
                <ul className="space-y-3">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No hay caracteristicas listadas.</p>
              )}
            </div>
          )}

          {activeTab === 2 && (
            <div>
              {specs && specs.length > 0 ? (
                <table className="w-full text-sm">
                  <tbody>
                    {specs.map((s, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="py-3 px-4 font-medium text-gray-600 w-1/3 border-b">
                          {s.key}
                        </td>
                        <td className="py-3 px-4 text-gray-800 border-b">
                          {s.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No hay especificaciones disponibles.</p>
              )}
            </div>
          )}

          {activeTab === 3 && (
            <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
              {product.is_dropship ? (
                <>
                  <p>
                    Este producto se envia directamente desde nuestro proveedor{" "}
                    <strong>{product.supplier_name || "externo"}</strong>.
                  </p>
                  {product.est_delivery && (
                    <p>
                      Tiempo estimado de entrega: <strong>{product.est_delivery}</strong>.
                    </p>
                  )}
                  <p>
                    El numero de seguimiento se te enviara por correo electronico
                    una vez que el producto sea despachado.
                  </p>
                </>
              ) : (
                <>
                  <p>Envios a todo el pais.</p>
                  <p>
                    Tiempo de entrega estimado: <strong>3-7 dias habiles</strong>.
                  </p>
                  <p>
                    Envio gratis en pedidos mayores a ₡50,000.
                  </p>
                  <p>
                    El numero de seguimiento se te enviara por correo electronico.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <img
            src={allImages[selectedImage]?.url}
            alt={product.name}
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handlePrevImage() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNextImage() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="absolute bottom-4 flex gap-2">
                {allImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setSelectedImage(i) }}
                    className={`w-2.5 h-2.5 rounded-full transition ${
                      i === selectedImage ? "bg-white" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Productos relacionados */}
      {related.length > 0 && (
        <div className="border-t py-16 px-6">
          <h2 className="text-2xl font-bold mb-8">
            Te puede interesar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <Link href={`/products/${p.id}`} key={p.id}>
                <div className="group">
                  {p.image && p.image.startsWith("http") ? (
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={300}
                      height={160}
                      className="h-48 w-full object-cover rounded-lg mb-3 group-hover:opacity-90 transition bg-gray-100"
                    />
                  ) : (
                    <div className="h-48 w-full bg-gray-100 rounded-lg mb-3" />
                  )}
                  <h3 className="font-medium text-sm truncate">{p.name}</h3>
                  <p className="text-sm text-gray-500">{p.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
