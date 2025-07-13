export interface Book {
  id: string
  title: string
  author: string
  isbn: string
  publishDate: string
  isAvailable: boolean
  currentLoanId?: string
}

export interface Member {
  id: string
  name: string
  membershipId: string
  email: string
  phone: string
  joinDate: string
}

export interface Loan {
  id: string
  bookId: string
  memberId: string
  loanDate: string
  returnDate: string
  actualReturnDate?: string
  isOverdue: boolean
  book?: Book
  member?: Member
}

export interface Reservation {
  id: string
  bookId: string
  memberId: string
  reservationDate: string
  status: "active" | "fulfilled" | "cancelled"
  book?: Book
  member?: Member
}

export interface Report {
  totalBooks: number
  totalMembers: number
  activeLoans: number
  overdueLoans: number
  reservations: number
}
