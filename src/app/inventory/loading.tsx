export default function InventoryLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-pulse">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded"></div>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
