"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"
import type { Reservation } from "@/lib/types"
import { Search, Calendar, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ReservationsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      const data = await api.getReservations()
      // Filter reservations for members to show only their own
      const filteredData =
        user?.role === "member" ? data.filter((reservation) => reservation.memberId === user.id) : data
      setReservations(filteredData)
    } catch (error) {
      console.error("Error fetching reservations:", error)
      toast({
        title: "Error",
        description: "Failed to fetch reservations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (reservationId: string) => {
    if (confirm("Are you sure you want to cancel this reservation?")) {
      try {
        // Mock cancellation - in real app, you'd have an API endpoint
        setReservations(reservations.filter((r) => r.id !== reservationId))
        toast({
          title: "Success",
          description: "Reservation cancelled successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to cancel reservation",
          variant: "destructive",
        })
      }
    }
  }

  const filteredReservations = reservations.filter(
    (reservation) =>
      reservation.book?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.member?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.book?.isbn.includes(searchTerm),
  )

  const activeReservations = filteredReservations.filter((r) => r.status === "active")

  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
              <p className="text-gray-600">
                {user?.role === "member" ? "Your book reservations" : "Manage book reservations"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{activeReservations.length}</div>
                <p className="text-sm text-gray-600">Active Reservations</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{reservations.filter((r) => r.status === "fulfilled").length}</div>
                <p className="text-sm text-gray-600">Fulfilled</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{reservations.filter((r) => r.status === "cancelled").length}</div>
                <p className="text-sm text-gray-600">Cancelled</p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search reservations by book title, member name, or ISBN..."
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
              {filteredReservations.map((reservation) => (
                <Card key={reservation.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{reservation.book?.title}</CardTitle>
                        <CardDescription>
                          {user?.role !== "member" &&
                            `Reserved by ${reservation.member?.name} • ${reservation.member?.membershipId}`}
                        </CardDescription>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          reservation.status === "active"
                            ? "bg-yellow-100 text-yellow-800"
                            : reservation.status === "fulfilled"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Book Author</p>
                        <p className="text-sm">{reservation.book?.author}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">ISBN</p>
                        <p className="text-sm">{reservation.book?.isbn}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Reserved Date</p>
                        <p className="text-sm">{new Date(reservation.reservationDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Queue Position</p>
                        <p className="text-sm">1st in queue</p>
                      </div>
                    </div>

                    {reservation.status === "active" && (
                      <Button size="sm" variant="destructive" onClick={() => handleCancel(reservation.id)}>
                        <X className="mr-1 h-3 w-3" />
                        Cancel Reservation
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}

              {filteredReservations.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations found</h3>
                    <p className="text-gray-600">
                      {user?.role === "member"
                        ? "You haven't made any reservations yet. Visit the Books page to reserve unavailable books."
                        : "No reservations have been made yet."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
