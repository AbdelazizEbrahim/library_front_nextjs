"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Users } from "lucide-react"

interface PerformanceMetricsProps {
  metrics: {
    utilizationRate: number
    overdueRate: number
    reservationFulfillmentRate: number
    memberSatisfactionScore: number
  }
}

export function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  const getScoreColor = (score: number, isReverse = false) => {
    if (isReverse) {
      if (score < 10) return "text-green-600"
      if (score < 20) return "text-yellow-600"
      return "text-red-600"
    }
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getProgressColor = (score: number, isReverse = false) => {
    if (isReverse) {
      if (score < 10) return "bg-green-500"
      if (score < 20) return "bg-yellow-500"
      return "bg-red-500"
    }
    if (score >= 90) return "bg-green-500"
    if (score >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="mr-2 h-5 w-5" />
          Performance Metrics
        </CardTitle>
        <CardDescription>Key performance indicators for library operations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Utilization Rate */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Book Utilization Rate</span>
              <span className={`text-sm font-bold ${getScoreColor(metrics.utilizationRate)}`}>
                {metrics.utilizationRate}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(metrics.utilizationRate)}`}
                style={{ width: `${metrics.utilizationRate}%` }}
              />
            </div>
          </div>

          {/* Overdue Rate */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Overdue Rate</span>
              <span className={`text-sm font-bold ${getScoreColor(metrics.overdueRate, true)}`}>
                {metrics.overdueRate}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(metrics.overdueRate, true)}`}
                style={{ width: `${metrics.overdueRate}%` }}
              />
            </div>
          </div>

          {/* Reservation Fulfillment Rate */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Reservation Fulfillment</span>
              <span className={`text-sm font-bold ${getScoreColor(metrics.reservationFulfillmentRate)}`}>
                {metrics.reservationFulfillmentRate}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(metrics.reservationFulfillmentRate)}`}
                style={{ width: `${metrics.reservationFulfillmentRate}%` }}
              />
            </div>
          </div>

          {/* Member Satisfaction */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Member Satisfaction</span>
              <div className="flex items-center">
                <Users className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm font-bold text-blue-600">{metrics.memberSatisfactionScore}/5.0</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500 bg-blue-500"
                style={{ width: `${(metrics.memberSatisfactionScore / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
