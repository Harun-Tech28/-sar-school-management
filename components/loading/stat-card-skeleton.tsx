"use client"

export default function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
          <div className="w-16 h-4 bg-gray-200 rounded-full"></div>
        </div>
        <div className="w-24 h-8 bg-gray-200 rounded mb-2"></div>
        <div className="w-32 h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
}

export function StatCardsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </div>
  )
}
