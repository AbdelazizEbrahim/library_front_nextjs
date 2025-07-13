"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { Sidebar } from "@/components/layout/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import type { Report } from "@/lib/types";
import {
  BookOpen,
  Users,
  FileText,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Settings,
  UserPlus,
  Plus,
  BarChart3,
  DollarSign,
  Shield,
  Database,
  Activity,
} from "lucide-react";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { TopBooks } from "@/components/dashboard/top-books";
import { PerformanceMetrics } from "@/components/dashboard/performance-metrics";
import { AdvancedBarChart } from "@/components/charts/advanced-bar-chart";
import { LineChart } from "@/components/charts/line-chart";
import { AreaChart } from "@/components/charts/area-chart";
import { DonutChart } from "@/components/charts/donut-chart";
import {
  getBookCategoryData,
  getLoanTrendData,
  getMembershipTrendData,
  getMemberActivityData,
  getBookStatusData,
  getMonthlyStats,
  getRecentActivities,
  getTopBooks,
  getPerformanceMetrics,
  getOverdueBooks,
} from "@/lib/chart-data";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await api.getReports();
        setReport(data);
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  const monthlyStats = getMonthlyStats();
  const recentActivities = getRecentActivities();
  const topBooks = getTopBooks();
  const bookCategoryData = getBookCategoryData();
  const bookStatusData = getBookStatusData();
  const performanceMetrics = getPerformanceMetrics();

  // Role-based access - Based on document analysis
  const isAdmin = user?.role === "admin"; // System administration, user management, advanced reports
  const isLibrarian = user?.role === "librarian"; // Daily operations: books, members, loans, basic reports
  const isMember = user?.role === "member"; // Browse books, reservations, personal dashboard

  const getWelcomeMessage = () => {
    if (isAdmin) return "System Administrator Dashboard";
    if (isLibrarian) return "Librarian Operations Dashboard";
    return "Member Dashboard";
  };

  const getWelcomeDescription = () => {
    if (isAdmin) return "Complete system oversight";
    if (isLibrarian) return "Daily library operations";
    return "Your personal library experience";
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
          {/* Enhanced Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                  {getWelcomeMessage()}
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                  {getWelcomeDescription()}
                </p>
                <div className="flex items-center mt-3 space-x-4">
                  <p className="text-sm text-gray-500">
                    Welcome back, {user?.name}!
                  </p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                    {user?.role}
                  </span>
                </div>
              </div>

              {/* Enhanced Quick Actions */}
              {(isLibrarian || isAdmin) && (
                <div className="flex space-x-3">
                  <Link href="/books">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Book
                    </Button>
                  </Link>
                  <Link href="/members">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-200 hover:bg-blue-50 bg-transparent">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Member
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Quick Stats for Librarians */}
          {(isLibrarian || isAdmin) && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
              <QuickStats
                title="Monthly Loans"
                value={monthlyStats.currentMonth.loans}
                change={monthlyStats.growth.loans}
                changeLabel="vs last month"
                icon={<FileText className="h-6 w-6 text-white" />}
                color="bg-gradient-to-br from-blue-500 to-blue-600"
              />
              <QuickStats
                title="Book Returns"
                value={monthlyStats.currentMonth.returns}
                change={monthlyStats.growth.returns}
                changeLabel="vs last month"
                icon={<TrendingUp className="h-6 w-6 text-white" />}
                color="bg-gradient-to-br from-green-500 to-green-600"
              />
              <QuickStats
                title="New Members"
                value={monthlyStats.currentMonth.newMembers}
                change={monthlyStats.growth.newMembers}
                changeLabel="vs last month"
                icon={<Users className="h-6 w-6 text-white" />}
                color="bg-gradient-to-br from-purple-500 to-purple-600"
              />
              <QuickStats
                title="New Books"
                value={monthlyStats.currentMonth.newBooks}
                change={monthlyStats.growth.newBooks}
                changeLabel="vs last month"
                icon={<BookOpen className="h-6 w-6 text-white" />}
                color="bg-gradient-to-br from-orange-500 to-orange-600"
              />
              {isAdmin && (
                <>
                  <QuickStats
                    title="Fines Collected"
                    value={`$${monthlyStats.currentMonth.fines}`}
                    change={monthlyStats.growth.fines}
                    changeLabel="vs last month"
                    icon={<AlertTriangle className="h-6 w-6 text-white" />}
                    color="bg-gradient-to-br from-red-500 to-red-600"
                  />
                </>
              )}
            </div>
          )}

          {/* Enhanced Member Dashboard */}
          {isMember && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-700">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Your Active Loans
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">2</div>
                  <p className="text-sm text-blue-600">
                    Books currently borrowed
                  </p>
                  <div className="mt-2 text-xs text-blue-500">
                    Next due: Dec 20, 2024
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-700">
                    <Calendar className="mr-2 h-5 w-5" />
                    Reservations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">1</div>
                  <p className="text-sm text-purple-600">Books reserved</p>
                  <div className="mt-2 text-xs text-purple-500">
                    Position #1 in queue
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-700">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    Due Soon
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">1</div>
                  <p className="text-sm text-red-600">Book due in 2 days</p>
                  <div className="mt-2 text-xs text-red-500">
                    The Great Gatsby
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Enhanced Charts Section */}
          {(isLibrarian || isAdmin) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Book Collection by Category */}
              <Card className="shadow-lg h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5 text-green-600" />
                    Book Collection by Category
                  </CardTitle>
                  <CardDescription>
                    Distribution and loan performance by category
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <AdvancedBarChart
                    data={bookCategoryData.map((cat) => ({
                      name: cat.category,
                      value: cat.books,
                      target: cat.loans * 4,
                      color: cat.color,
                    }))}
                    height={280}
                    showTarget={true}
                  />
                </CardContent>
              </Card>

              {/* Book Status Distribution */}
              <Card className="shadow-lg h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="mr-2 h-5 w-5 text-orange-600" />
                    Book Status Overview
                  </CardTitle>
                  <CardDescription>Current status of all books</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex justify-center items-center">
                  <DonutChart
                    data={bookStatusData.map((item) => ({
                      name: item.name,
                      value: item.value,
                      color: item.color ?? "#8884d8", // fallback to default color
                    }))}
                    size={200}
                  />
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card className="shadow-lg h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription>
                    System-wide metrics and benchmarks
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <PerformanceMetrics metrics={performanceMetrics} />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Enhanced Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Activity */}
            <div className="lg:col-span-1">
              <ActivityFeed
                activities={
                  isMember ? recentActivities.slice(0, 5) : recentActivities
                }
              />
            </div>

            {/* Top Books or Quick Links */}
            <div className="lg:col-span-1">
              {isLibrarian || isAdmin ? (
                <TopBooks books={topBooks} />
              ) : (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Quick Access</CardTitle>
                    <CardDescription>Frequently used features</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Link href="/books">
                        <Button
                          variant="outline"
                          className="w-full h-20 flex flex-col bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200">
                          <BookOpen className="h-6 w-6 mb-2 text-blue-600" />
                          <span className="text-blue-700">Browse Books</span>
                        </Button>
                      </Link>
                      <Link href="/reservations">
                        <Button
                          variant="outline"
                          className="w-full h-20 flex flex-col bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-200">
                          <Calendar className="h-6 w-6 mb-2 text-purple-600" />
                          <span className="text-purple-700">
                            My Reservations
                          </span>
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Admin-only System Administration */}
          {isAdmin && (
            <Card className="shadow-lg bg-gradient-to-r from-gray-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-blue-600" />
                  System Administration
                </CardTitle>
                <CardDescription>
                  System health monitoring and administrative controls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600">
                      99.9%
                    </div>
                    <div className="text-sm text-green-700">System Uptime</div>
                    <div className="text-xs text-green-500 mt-1">
                      Last 30 days
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">
                      1.2GB
                    </div>
                    <div className="text-sm text-blue-700">Database Size</div>
                    <div className="text-xs text-blue-500 mt-1">
                      Growing 2% monthly
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">3</div>
                    <div className="text-sm text-purple-700">Active Users</div>
                    <div className="text-xs text-purple-500 mt-1">
                      Currently online
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                    <div className="text-2xl font-bold text-orange-600">
                      Today
                    </div>
                    <div className="text-sm text-orange-700">Last Backup</div>
                    <div className="text-xs text-orange-500 mt-1">
                      Automated daily
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-200 hover:bg-blue-50 bg-transparent">
                    <Settings className="mr-2 h-4 w-4" />
                    System Settings
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-200 hover:bg-green-50 bg-transparent">
                    <Database className="mr-2 h-4 w-4" />
                    Database Management
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-purple-200 hover:bg-purple-50 bg-transparent">
                    <Users className="mr-2 h-4 w-4" />
                    User Management
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
