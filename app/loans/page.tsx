"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"
import type { Loan } from "@/lib/types"
import { Plus, Search, RotateCcw, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { LoanForm } from "@/components/loan-form"

export default function LoansPage() {
  const { toast } = useToast()
  const [loans, setLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchLoans()
  }, [])

  const fetchLoans = async () => {
    try {
      const data = await api.getLoans()
      setLoans(data)
    } catch (error) {
      console.error("Error fetching loans:", error)
      toast({
        title: "Error",
        description: "Failed to fetch loans",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReturn = async (loanId: string) => {
    try {
      await api.returnBook(loanId)
      fetchLoans()
      toast({
        title: "Success",
        description: "Book returned successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to return book",
        variant: "destructive",
      })
    }
  }

  const filteredLoans = loans.filter(
    (loan) =>
      loan.book?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.member?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.book?.isbn.includes(searchTerm),
  )

  const activeLoans = filteredLoans.filter((loan) => !loan.actualReturnDate)
  const overdueLoans = activeLoans.filter((loan) => loan.isOverdue)

  return (
    <ProtectedRoute allowedRoles={["admin", "librarian"]}>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Loans</h1>
              <p className="text-gray-600">Manage book loans and returns</p>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Loan
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{activeLoans.length}</div>
                <p className="text-sm text-gray-600">Active Loans</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">{overdueLoans.length}</div>
                <p className="text-sm text-gray-600">Overdue Loans</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{loans.filter((l) => l.actualReturnDate).length}</div>
                <p className="text-sm text-gray-600">Returned Books</p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search loans by book title, member name, or ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLoans.map((loan) => (
                <Card key={loan.id} className={loan.isOverdue && !loan.actualReturnDate ? "border-red-200" : ""}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{loan.book?.title}</CardTitle>
                        <CardDescription>
                          Borrowed by {loan.member?.name} • {loan.member?.membershipId}
                        </CardDescription>
                      </div>
                      {loan.isOverdue && !loan.actualReturnDate && (
                        <div className="flex items-center text-red-600">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">Overdue</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Loan Date</p>
                        <p className="text-sm">{new Date(loan.loanDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Due Date</p>
                        <p className="text-sm">{new Date(loan.returnDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            loan.actualReturnDate
                              ? "bg-green-100 text-green-800"
                              : loan.isOverdue
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {loan.actualReturnDate ? "Returned" : loan.isOverdue ? "Overdue" : "Active"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">ISBN</p>
                        <p className="text-sm">{loan.book?.isbn}</p>
                      </div>
                    </div>

                    {loan.actualReturnDate ? (
                      <div className="text-sm text-gray-600">
                        <strong>Returned on:</strong> {new Date(loan.actualReturnDate).toLocaleDateString()}
                      </div>
                    ) : (
                      <Button size="sm" onClick={() => handleReturn(loan.id)} className="mt-2">
                        <RotateCcw className="mr-1 h-3 w-3" />
                        Mark as Returned
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {showForm && (
            <LoanForm
              onClose={() => setShowForm(false)}
              onSave={() => {
                fetchLoans()
                setShowForm(false)
              }}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
