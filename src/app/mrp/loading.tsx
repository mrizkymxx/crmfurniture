export default function MRPLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 shadow rounded-lg">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white p-6 shadow rounded-lg">
            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-16 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
