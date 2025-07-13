"use client"

interface DonutChartProps {
  data: Array<{ name: string; value: number; color: string }>
  size?: number
  className?: string
}

export function DonutChart({ data, size = 200, className = "" }: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const radius = size / 2 - 20
  const innerRadius = radius * 0.6
  const center = size / 2

  let cumulativePercentage = 0

  const createArc = (percentage: number, startPercentage: number) => {
    const startAngle = startPercentage * 2 * Math.PI
    const endAngle = (startPercentage + percentage) * 2 * Math.PI

    const x1 = center + radius * Math.cos(startAngle)
    const y1 = center + radius * Math.sin(startAngle)
    const x2 = center + radius * Math.cos(endAngle)
    const y2 = center + radius * Math.sin(endAngle)

    const x3 = center + innerRadius * Math.cos(endAngle)
    const y3 = center + innerRadius * Math.sin(endAngle)
    const x4 = center + innerRadius * Math.cos(startAngle)
    const y4 = center + innerRadius * Math.sin(startAngle)

    const largeArc = percentage > 0.5 ? 1 : 0

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`
  }

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative">
        <svg width={size} height={size}>
          {data.map((item, index) => {
            const percentage = item.value / total
            const path = createArc(percentage, cumulativePercentage)
            cumulativePercentage += percentage

            return (
              <path
                key={index}
                d={path}
                fill={item.color}
                className="transition-all duration-300 hover:opacity-80"
                title={`${item.name}: ${item.value}`}
              />
            )
          })}
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{total}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="ml-6 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: item.color }} />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">{item.name}</div>
              <div className="text-xs text-gray-500">
                {item.value} ({Math.round((item.value / total) * 100)}%)
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
