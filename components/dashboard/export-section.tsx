"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, Table, BarChart3 } from "lucide-react"
import { generatePDFReport, generateCSVReport, type ReportData } from "@/lib/pdf-export"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

interface ExportSectionProps {
  reportData: any
}

export function ExportSection({ reportData }: ExportSectionProps) {
  const { toast } = useToast()
  const { user } = useAuth()

  const handlePDFExport = async () => {
    try {
      const data: ReportData = {
        title: "Library Management System Report",
        generatedAt: new Date().toLocaleString(),
        generatedBy: user?.name || "Unknown User",
        summary: reportData.summary || {
          totalBooks: 0,
          totalMembers: 0,
          activeLoans: 0,
          overdueLoans: 0,
          reservations: 0,
        },
        charts: {
          bookCategories: reportData.bookCategories || [],
          loanTrends: reportData.loanTrends || [],
          topBooks: reportData.topBooks || [],
        },
        overdueBooks: reportData.overdueBooks || [],
      }

      await generatePDFReport(data)
      toast({
        title: "Success",
        description: "PDF report generated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF report",
        variant: "destructive",
      })
    }
  }

  const handleCSVExport = (type: string) => {
    try {
      let data: any[] = []
      let filename = ""

      switch (type) {
        case "books":
          data = reportData.bookCategories || []
          filename = "book-categories"
          break
        case "loans":
          data = reportData.loanTrends || []
          filename = "loan-trends"
          break
        case "overdue":
          data = reportData.overdueBooks || []
          filename = "overdue-books"
          break
        default:
          return
      }

      generateCSVReport(data, filename)
      toast({
        title: "Success",
        description: `${type} data exported successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to export ${type} data`,
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Download className="mr-2 h-5 w-5" />
          Export Reports
        </CardTitle>
        <CardDescription>Download reports in various formats</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* PDF Export */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Complete Report</h4>
            <Button onClick={handlePDFExport} className="w-full bg-transparent" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Export PDF Report
            </Button>
          </div>

          {/* CSV Exports */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Data Exports</h4>
            <div className="space-y-2">
              <Button onClick={() => handleCSVExport("books")} className="w-full" variant="outline" size="sm">
                <Table className="mr-2 h-4 w-4" />
                Book Categories CSV
              </Button>
              <Button onClick={() => handleCSVExport("loans")} className="w-full" variant="outline" size="sm">
                <BarChart3 className="mr-2 h-4 w-4" />
                Loan Trends CSV
              </Button>
              <Button onClick={() => handleCSVExport("overdue")} className="w-full" variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Overdue Books CSV
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700">
            <strong>Note:</strong> PDF reports include comprehensive analytics and charts. CSV exports contain raw data
            for further analysis.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
