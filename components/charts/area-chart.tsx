"use client"

interface AreaChartProps {
  data: Array<{ month: string; newMembers: number; totalMembers: number }>
  height?: number
  className?: string
}

export function AreaChart({ data, height = 250, className = "" }: AreaChartProps) {
  const maxValue = Math.max(...data.map((item) => item.totalMembers))
  const width = 100

  const getPath = (values: number[], type: "area" | "line" = "line") => {
    const points = values
      .map((value, index) => {
        const x = (index / (values.length - 1)) * width
        const y = height - 40 - (value / maxValue) * (height - 60)
        return `${x},${y}`
      })
      .join(" ")

    if (type === "area") {
      const firstPoint = values[0]
      const lastPoint = values[values.length - 1]
      const firstX = 0
      const lastX = width
      const bottomY = height - 40

      return (
        <path
          d={`M ${firstX},${height - 40 - (firstPoint / maxValue) * (height - 60)} L ${points} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`}
          fill="url(#gradient)"
          fillOpacity="0.3"
        />
      )
    }

    return (
      <polyline fill="none" stroke="#3B82F6" strokeWidth="3" points={points} className="transition-all duration-300" />
    )
  }

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
          </linearGradient>
        </defs>

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

        {/* Area */}
        {getPath(
          data.map((d) => d.totalMembers),
          "area",
        )}

        {/* Line */}
        {getPath(
          data.map((d) => d.totalMembers),
          "line",
        )}

        {/* Data points */}
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * width
          const y = height - 40 - (item.totalMembers / maxValue) * (height - 60)
          return (
            <g key={index}>
              <circle cx={x} cy={y} r="4" fill="#3B82F6" stroke="white" strokeWidth="2" />
              <text x={x} y={height - 15} textAnchor="middle" className="text-xs fill-gray-600">
                {item.month}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
