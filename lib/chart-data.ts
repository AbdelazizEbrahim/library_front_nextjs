// Enhanced chart data and utilities for dashboard
export interface ChartData {
  name: string
  value: number
  color?: string
}

export interface TrendData {
  date: string
  loans: number
  returns: number
  reservations: number
}

export interface CategoryData {
  category: string
  books: number
  loans: number
  percentage: number
  color: string
}

export interface MembershipData {
  month: string
  newMembers: number
  totalMembers: number
}

export interface PerformanceMetrics {
  utilizationRate: number
  overdueRate: number
  reservationFulfillmentRate: number
  memberSatisfactionScore: number
}

// Enhanced mock chart data
export const getBookCategoryData = (): CategoryData[] => [
  { category: "Fiction", books: 450, loans: 120, percentage: 35, color: "#3B82F6" },
  { category: "Non-Fiction", books: 320, loans: 85, percentage: 25, color: "#10B981" },
  { category: "Science", books: 280, loans: 95, percentage: 20, color: "#8B5CF6" },
]

export const getLoanTrendData = (): TrendData[] => [
  { date: "2024-12-01", loans: 15, returns: 12, reservations: 8 },
  { date: "2024-12-02", loans: 18, returns: 14, reservations: 6 },
  { date: "2024-12-03", loans: 22, returns: 16, reservations: 10 },
  { date: "2024-12-04", loans: 19, returns: 20, reservations: 7 },
  { date: "2024-12-05", loans: 25, returns: 18, reservations: 12 },
  { date: "2024-12-06", loans: 21, returns: 22, reservations: 9 },
  { date: "2024-12-07", loans: 28, returns: 19, reservations: 15 },
]

export const getMembershipTrendData = (): MembershipData[] => [
  { month: "Jan", newMembers: 12, totalMembers: 245 },
  { month: "Feb", newMembers: 18, totalMembers: 263 },
  { month: "Mar", newMembers: 15, totalMembers: 278 },
  { month: "Apr", newMembers: 22, totalMembers: 300 },
  { month: "May", newMembers: 19, totalMembers: 319 },
  { month: "Jun", newMembers: 25, totalMembers: 344 },
]

export const getMemberActivityData = (): ChartData[] => [
  { name: "Active Members", value: 85, color: "#10B981" },
  { name: "Inactive Members", value: 15, color: "#EF4444" },
]

export const getBookStatusData = (): ChartData[] => [
  { name: "Available", value: 1250, color: "#10B981" },
  { name: "On Loan", value: 180, color: "#F59E0B" },
  { name: "Reserved", value: 45, color: "#8B5CF6" },
  { name: "Maintenance", value: 25, color: "#EF4444" },
]

export const getPerformanceMetrics = (): PerformanceMetrics => ({
  utilizationRate: 78.5,
  overdueRate: 12.3,
  reservationFulfillmentRate: 94.2,
  memberSatisfactionScore: 4.6,
})

export const getMonthlyStats = () => ({
  currentMonth: {
    loans: 156,
    returns: 142,
    newMembers: 12,
    newBooks: 28,
    revenue: 2450,
    fines: 180,
  },
  previousMonth: {
    loans: 134,
    returns: 128,
    newMembers: 8,
    newBooks: 15,
    revenue: 2100,
    fines: 220,
  },
  growth: {
    loans: 16.4,
    returns: 10.9,
    newMembers: 50.0,
    newBooks: 86.7,
    revenue: 16.7,
    fines: -18.2,
  },
})

export const getRecentActivities = () => [
  {
    id: 1,
    type: "loan",
    message: "The Great Gatsby loaned to John Doe",
    time: "2 minutes ago",
    icon: "📚",
    priority: "normal",
  },
  {
    id: 2,
    type: "return",
    message: "To Kill a Mockingbird returned by Jane Smith",
    time: "15 minutes ago",
    icon: "↩️",
    priority: "normal",
  },
  {
    id: 3,
    type: "overdue",
    message: "1984 is 3 days overdue (Mike Johnson)",
    time: "1 hour ago",
    icon: "⚠️",
    priority: "high",
  },
  {
    id: 4,
    type: "reservation",
    message: "Pride and Prejudice reserved by Sarah Wilson",
    time: "2 hours ago",
    icon: "📅",
    priority: "normal",
  },
  {
    id: 5,
    type: "member",
    message: "New member Alex Brown registered",
    time: "3 hours ago",
    icon: "👤",
    priority: "normal",
  },
  {
    id: 6,
    type: "book",
    message: "New book 'Dune' added to collection",
    time: "4 hours ago",
    icon: "➕",
    priority: "normal",
  },
]

export const getTopBooks = () => [
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald", loans: 45, rating: 4.8, category: "Fiction" },
  { title: "To Kill a Mockingbird", author: "Harper Lee", loans: 42, rating: 4.9, category: "Fiction" },
  { title: "1984", author: "George Orwell", loans: 38, rating: 4.7, category: "Fiction" },
  { title: "Pride and Prejudice", author: "Jane Austen", loans: 35, rating: 4.6, category: "Fiction" },
]

export const getOverdueBooks = () => [
  { title: "1984", member: "Mike Johnson", dueDate: "2024-12-01", daysOverdue: 12 },
  { title: "Brave New World", member: "Sarah Davis", dueDate: "2024-12-03", daysOverdue: 10 },
  { title: "The Hobbit", member: "Tom Wilson", dueDate: "2024-12-05", daysOverdue: 8 },
  { title: "Animal Farm", member: "Lisa Brown", dueDate: "2024-12-07", daysOverdue: 6 },
]
