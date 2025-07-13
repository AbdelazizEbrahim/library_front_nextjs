"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"

interface Book {
  title: string
  author: string
  loans: number
  rating: number
}

interface TopBooksProps {
  books: Book[]
}

export function TopBooks({ books }: TopBooksProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Popular Books</CardTitle>
        <CardDescription>Top borrowed books this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {books.map((book, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{book.title}</p>
                  <p className="text-sm text-gray-500">{book.author}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{book.rating}</span>
                </div>
                <p className="text-xs text-gray-500">{book.loans} loans</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
