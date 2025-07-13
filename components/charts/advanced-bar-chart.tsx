"use client"

interface AdvancedBarChartProps {
  data: Array<{ name: string; value: number; color?: string; target?: number }>
  height?: number
  className?: string
  showTarget?: boolean
}

export function AdvancedBarChart({ data, height = 300, className = "", showTarget = false }: AdvancedBarChartProps) {
  const maxValue = Math.max(...data.map((item) => Math.max(item.value, item.target || 0)))

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <div className="flex items-end justify-between h-full space-x-3">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="w-full flex items-end justify-center relative" style={{ height: height - 60 }}>
              {/* Target line */}
              {showTarget && item.target && (
                <div
                  className="absolute w-full border-t-2 border-dashed border-gray-400"
                  style={{
                    bottom: `${(item.target / maxValue) * 100}%`,
                  }}
                />
              )}

              {/* Main bar */}
              <div
                className="w-full rounded-t-lg transition-all duration-700 ease-in-out hover:opacity-80 relative group"
                style={{
                  height: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color || "#3B82F6",
                  minHeight: "8px",
                }}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.name}: {item.value}
                  {showTarget && item.target && ` (Target: ${item.target})`}
                </div>
              </div>
            </div>

            <div className="mt-3 text-center">
              <div className="text-sm font-medium text-gray-700">{item.name}</div>
              <div className="text-xs text-gray-500">{item.value}</div>
              {showTarget && item.target && <div className="text-xs text-gray-400">Target: {item.target}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
