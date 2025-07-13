import type { Book, Member, Loan, Reservation, Report } from "./types"

// Mock data
const mockBooks: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "978-0-7432-7356-5",
    publishDate: "1925-04-10",
    isAvailable: true,
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "978-0-06-112008-4",
    publishDate: "1960-07-11",
    isAvailable: false,
    currentLoanId: "1",
  },
  {
    id: "3",
    title: "1984",
    author: "George Orwell",
    isbn: "978-0-452-28423-4",
    publishDate: "1949-06-08",
    isAvailable: true,
  },
]

const mockMembers: Member[] = [
  {
    id: "1",
    name: "John Doe",
    membershipId: "MEM001",
    email: "john.doe@email.com",
    phone: "+1-555-0123",
    joinDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    membershipId: "MEM002",
    email: "jane.smith@email.com",
    phone: "+1-555-0124",
    joinDate: "2024-02-20",
  },
]

const mockLoans: Loan[] = [
  {
    id: "1",
    bookId: "2",
    memberId: "1",
    loanDate: "2024-12-01",
    returnDate: "2024-12-15",
    isOverdue: true,
    book: mockBooks[1],
    member: mockMembers[0],
  },
]

const mockReservations: Reservation[] = [
  {
    id: "1",
    bookId: "2",
    memberId: "2",
    reservationDate: "2024-12-10",
    status: "active",
    book: mockBooks[1],
    member: mockMembers[1],
  },
]

// API functions
export const api = {
  // Books
  async getBooks(): Promise<Book[]> {
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay
    return mockBooks
  },

  async getBook(id: string): Promise<Book | null> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockBooks.find((book) => book.id === id) || null
  },

  async createBook(book: Omit<Book, "id" | "isAvailable">): Promise<Book> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newBook: Book = {
      ...book,
      id: Date.now().toString(),
      isAvailable: true,
    }
    mockBooks.push(newBook)
    return newBook
  },

  async updateBook(id: string, book: Partial<Book>): Promise<Book | null> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = mockBooks.findIndex((b) => b.id === id)
    if (index !== -1) {
      mockBooks[index] = { ...mockBooks[index], ...book }
      return mockBooks[index]
    }
    return null
  },

  async deleteBook(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = mockBooks.findIndex((book) => book.id === id)
    if (index !== -1) {
      mockBooks.splice(index, 1)
      return true
    }
    return false
  },

  // Members
  async getMembers(): Promise<Member[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockMembers
  },

  async getMember(id: string): Promise<Member | null> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockMembers.find((member) => member.id === id) || null
  },

  async createMember(member: Omit<Member, "id" | "joinDate">): Promise<Member> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newMember: Member = {
      ...member,
      id: Date.now().toString(),
      joinDate: new Date().toISOString().split("T")[0],
    }
    mockMembers.push(newMember)
    return newMember
  },

  async updateMember(id: string, member: Partial<Member>): Promise<Member | null> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = mockMembers.findIndex((m) => m.id === id)
    if (index !== -1) {
      mockMembers[index] = { ...mockMembers[index], ...member }
      return mockMembers[index]
    }
    return null
  },

  async deleteMember(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = mockMembers.findIndex((member) => member.id === id)
    if (index !== -1) {
      mockMembers.splice(index, 1)
      return true
    }
    return false
  },

  // Loans
  async getLoans(): Promise<Loan[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockLoans.map((loan) => ({
      ...loan,
      book: mockBooks.find((b) => b.id === loan.bookId),
      member: mockMembers.find((m) => m.id === loan.memberId),
    }))
  },

  async createLoan(loan: Omit<Loan, "id" | "isOverdue">): Promise<Loan | null> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Check if book is available
    const book = mockBooks.find((b) => b.id === loan.bookId)
    if (!book || !book.isAvailable) {
      throw new Error("Book is not available for loan")
    }

    const newLoan: Loan = {
      ...loan,
      id: Date.now().toString(),
      isOverdue: new Date(loan.returnDate) < new Date(),
    }

    // Update book availability
    book.isAvailable = false
    book.currentLoanId = newLoan.id

    mockLoans.push(newLoan)
    return {
      ...newLoan,
      book,
      member: mockMembers.find((m) => m.id === loan.memberId),
    }
  },

  async returnBook(loanId: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const loan = mockLoans.find((l) => l.id === loanId)
    if (loan) {
      loan.actualReturnDate = new Date().toISOString().split("T")[0]
      const book = mockBooks.find((b) => b.id === loan.bookId)
      if (book) {
        book.isAvailable = true
        book.currentLoanId = undefined
      }
      return true
    }
    return false
  },

  // Reservations
  async getReservations(): Promise<Reservation[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockReservations.map((reservation) => ({
      ...reservation,
      book: mockBooks.find((b) => b.id === reservation.bookId),
      member: mockMembers.find((m) => m.id === reservation.memberId),
    }))
  },

  async createReservation(reservation: Omit<Reservation, "id" | "reservationDate" | "status">): Promise<Reservation> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newReservation: Reservation = {
      ...reservation,
      id: Date.now().toString(),
      reservationDate: new Date().toISOString().split("T")[0],
      status: "active",
    }
    mockReservations.push(newReservation)
    return {
      ...newReservation,
      book: mockBooks.find((b) => b.id === reservation.bookId),
      member: mockMembers.find((m) => m.id === reservation.memberId),
    }
  },

  // Reports
  async getReports(): Promise<Report> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      totalBooks: mockBooks.length,
      totalMembers: mockMembers.length,
      activeLoans: mockLoans.filter((l) => !l.actualReturnDate).length,
      overdueLoans: mockLoans.filter((l) => l.isOverdue && !l.actualReturnDate).length,
      reservations: mockReservations.filter((r) => r.status === "active").length,
    }
  },

  async getOverdueLoans(): Promise<Loan[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockLoans
      .filter((loan) => loan.isOverdue && !loan.actualReturnDate)
      .map((loan) => ({
        ...loan,
        book: mockBooks.find((b) => b.id === loan.bookId),
        member: mockMembers.find((m) => m.id === loan.memberId),
      }))
  },
}
