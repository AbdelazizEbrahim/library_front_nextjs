"use client"

interface LineChartProps {
  data: Array<{ date: string; loans: number; returns: number; reservations: number }>
  height?: number
  className?: string
}

export function LineChart({ data, height = 200, className = "" }: LineChartProps) {
  const maxValue = Math.max(...data.flatMap((item) => [item.loans, item.returns, item.reservations]))
  const width = 100

  const getPath = (values: number[], color: string) => {
    const points = values
      .map((value, index) => {
        const x = (index / (values.length - 1)) * width
        const y = height - 40 - (value / maxValue) * (height - 60)
        return `${x},${y}`
      })
      .join(" ")

    return (
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} className="transition-all duration-300" />
    )
  }

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
          <line
            key={index}
            x1="0"
            y1={20 + ratio * (height - 60)}
            x2={width}
            y2={20 + ratio * (height - 60)}
            stroke="#E5E7EB"
            strokeWidth="1"
          />
        ))}

        {/* Lines */}
        {getPath(
          data.map((d) => d.loans),
          "#3B82F6",
        )}
        {getPath(
          data.map((d) => d.returns),
          "#10B981",
        )}
        {getPath(
          data.map((d) => d.reservations),
          "#8B5CF6",
        )}

        {/* Data points */}
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * width
          return (
            <g key={index}>
              <circle cx={x} cy={height - 40 - (item.loans / maxValue) * (height - 60)} r="3" fill="#3B82F6" />
              <circle cx={x} cy={height - 40 - (item.returns / maxValue) * (height - 60)} r="3" fill="#10B981" />
              <circle cx={x} cy={height - 40 - (item.reservations / maxValue) * (height - 60)} r="3" fill="#8B5CF6" />
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-xs text-gray-600">Loans</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-xs text-gray-600">Returns</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
          <span className="text-xs text-gray-600">Reservations</span>
        </div>
      </div>
    </div>
  )
}
