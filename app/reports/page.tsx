"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"
import type { Report, Loan } from "@/lib/types"
import { BarChart3, FileText, AlertTriangle, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ReportsPage() {
  const { toast } = useToast()
  const [report, setReport] = useState<Report | null>(null)
  const [overdueLoans, setOverdueLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const [reportData, overdueData] = await Promise.all([api.getReports(), api.getOverdueLoans()])
      setReport(reportData)
      setOverdueLoans(overdueData)
    } catch (error) {
      console.error("Error fetching reports:", error)
      toast({
        title: "Error",
        description: "Failed to fetch reports",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      title: "Total Books",
      value: report?.totalBooks || 0,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "Books in collection",
    },
    {
      title: "Active Members",
      value: report?.totalMembers || 0,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: "Registered members",
    },
    {
      title: "Current Loans",
      value: report?.activeLoans || 0,
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      description: "Books currently on loan",
    },
    {
      title: "Overdue Books",
      value: report?.overdueLoans || 0,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100",
      description: "Books past due date",
    },
  ]

  return (
    <ProtectedRoute allowedRoles={["admin", "librarian"]}>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600">Library statistics and overdue books</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => {
                  const Icon = stat.icon
                  return (
                    <Card key={stat.title}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <div className={`p-2 rounded-full ${stat.bgColor}`}>
                          <Icon className={`h-4 w-4 ${stat.color}`} />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">{stat.description}</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
                      Overdue Books
                    </CardTitle>
                    <CardDescription>Books that are past their return date</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {overdueLoans.length === 0 ? (
                      <p className="text-gray-600 text-center py-4">No overdue books at this time</p>
                    ) : (
                      <div className="space-y-3">
                        {overdueLoans.slice(0, 5).map((loan) => (
                          <div key={loan.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{loan.book?.title}</p>
                              <p className="text-xs text-gray-600">
                                {loan.member?.name} • Due: {new Date(loan.returnDate).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                              {Math.floor((Date.now() - new Date(loan.returnDate).getTime()) / (1000 * 60 * 60 * 24))}{" "}
                              days
                            </span>
                          </div>
                        ))}
                        {overdueLoans.length > 5 && (
                          <p className="text-sm text-gray-600 text-center">
                            And {overdueLoans.length - 5} more overdue books...
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
                      Library Statistics
                    </CardTitle>
                    <CardDescription>Key performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Books Available</span>
                        <span className="font-medium">{(report?.totalBooks || 0) - (report?.activeLoans || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Books on Loan</span>
                        <span className="font-medium">{report?.activeLoans || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Utilization Rate</span>
                        <span className="font-medium">
                          {report?.totalBooks ? Math.round(((report.activeLoans || 0) / report.totalBooks) * 100) : 0}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Active Reservations</span>
                        <span className="font-medium">{report?.reservations || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Overdue Rate</span>
                        <span className="font-medium text-red-600">
                          {report?.activeLoans
                            ? Math.round(((report.overdueLoans || 0) / report.activeLoans) * 100)
                            : 0}
                          %
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
