"use client"

interface BarChartProps {
  data: Array<{ name: string; value: number; color?: string }>
  height?: number
  className?: string
}

export function BarChart({ data, height = 200, className = "" }: BarChartProps) {
  const maxValue = Math.max(...data.map((item) => item.value))

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <div className="flex items-end justify-between h-full space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="w-full flex items-end justify-center" style={{ height: height - 40 }}>
              <div
                className="w-full rounded-t-md transition-all duration-500 ease-in-out hover:opacity-80"
                style={{
                  height: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color || "#3B82F6",
                  minHeight: "4px",
                }}
                title={`${item.name}: ${item.value}`}
              />
            </div>
            <div className="mt-2 text-xs text-center text-gray-600 font-medium">{item.name}</div>
            <div className="text-xs text-gray-500">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
