"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"
import type { Book } from "@/lib/types"
import { Plus, Search, Edit, Trash2, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { BookForm } from "@/components/book-form"

export default function BooksPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      const data = await api.getBooks()
      setBooks(data)
    } catch (error) {
      console.error("Error fetching books:", error)
      toast({
        title: "Error",
        description: "Failed to fetch books",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this book?")) {
      try {
        await api.deleteBook(id)
        setBooks(books.filter((book) => book.id !== id))
        toast({
          title: "Success",
          description: "Book deleted successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete book",
          variant: "destructive",
        })
      }
    }
  }

  const handleReserve = async (bookId: string) => {
    if (!user) return

    try {
      await api.createReservation({ bookId, memberId: user.id })
      toast({
        title: "Success",
        description: "Book reserved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reserve book",
        variant: "destructive",
      })
    }
  }

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm),
  )

  const canManageBooks = user?.role === "admin" || user?.role === "librarian"

  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Books</h1>
              <p className="text-gray-600">Manage your library collection</p>
            </div>
            {canManageBooks && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Book
              </Button>
            )}
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search books by title, author, or ISBN..."
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <Card key={book.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{book.title}</CardTitle>
                    <CardDescription>by {book.author}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">
                        <strong>ISBN:</strong> {book.isbn}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Published:</strong> {new Date(book.publishDate).toLocaleDateString()}
                      </p>
                      <div className="flex items-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            book.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {book.isAvailable ? "Available" : "On Loan"}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {user?.role === "member" && !book.isAvailable && (
                        <Button size="sm" variant="outline" onClick={() => handleReserve(book.id)}>
                          <Calendar className="mr-1 h-3 w-3" />
                          Reserve
                        </Button>
                      )}

                      {canManageBooks && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingBook(book)
                              setShowForm(true)
                            }}
                          >
                            <Edit className="mr-1 h-3 w-3" />
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(book.id)}>
                            <Trash2 className="mr-1 h-3 w-3" />
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {showForm && (
            <BookForm
              book={editingBook}
              onClose={() => {
                setShowForm(false)
                setEditingBook(null)
              }}
              onSave={() => {
                fetchBooks()
                setShowForm(false)
                setEditingBook(null)
              }}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
