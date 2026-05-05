export default function Loading() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow space-y-3">
            <div className="h-40 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
