"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { getAllPaymentHistoryService } from "../../services/admin/paymentService" // Assuming this path is correct

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Search, Download, DollarSign, CreditCard, TrendingUp, Users, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton" // Import Skeleton for loading state
import { useAdminGetPayment } from "../../hooks/admin/useAdminPayment"


// --- NOTE: Chart data is static for demonstration. ---
// In a real application, you would derive this data from `fetchedPayments`.

const paymentMethodData = [
  { name: "eSewa", value: 100, color: "#60BB46" },
]

// --- Helper Functions for clarity ---
const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "completed": return "default"
    case "pending": return "secondary"
    case "failed": return "destructive"
    default: return "outline"
  }
}

const formatStatus = (status) => {
  if (status === 'success') return 'Completed'
  if (status === 'failure') return 'Failed'
  return 'Pending'
}

// Map internal plan names to user-friendly display names
const planDisplayNames = {
  'Pro': 'Pro Plan',
  'Premium': 'Premium Plan',
}

export function PaymentsReports() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [limit] = useState(10)

  const { data: queryData, isLoading, isError, error, isFetching } = useAdminGetPayment({ page, limit, search: searchTerm, status: statusFilter })

  // Backend handles filtering now, so we just use the data directly
  const payments = useMemo(() => {
    if (!queryData?.data) return []
    return queryData.data.map(p => ({
      id: p._id,
      transactionId: p.transaction_uuid,
      user: p.userId?.name || "N/A",
      email: p.userId?.email || "N/A",
      plan: planDisplayNames[p.plan] || p.plan,
      amount: p.amount,
      status: formatStatus(p.status),
      method: "eSewa",
      date: new Date(p.createdAt).toLocaleDateString(),
      time: new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }))
  }, [queryData])

  const pagination = queryData?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 }


  const summaryStats = useMemo(() => {
    const rawPayments = queryData?.data || []
    const totalRevenue = rawPayments.reduce(
      (sum, payment) => (payment.status === "success" ? sum + payment.amount : sum),
      0,
    )
    const completedTransactions = rawPayments.filter((p) => p.status === "success").length
    const pendingTransactions = rawPayments.filter((p) => p.status === "pending").length
    const successRate = rawPayments.length > 0 ? ((completedTransactions / (completedTransactions + rawPayments.filter(p => p.status === 'failure').length)) * 100).toFixed(1) : 0
    
    return { totalRevenue, completedTransactions, pendingTransactions, successRate }
  }, [queryData])

  // Reset to page 1 when filters change
  const handleSearchChange = (value) => {
    setSearchTerm(value)
    setPage(1)
  }

  const handleStatusChange = (value) => {
    setStatusFilter(value)
    setPage(1)
  }

  if (isLoading) {
    return <PaymentsReportsSkeleton />
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 p-6 bg-red-50 dark:bg-red-900/10 rounded-lg">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-semibold">Failed to load data</h2>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments & Reports</h1>
          <p className="text-muted-foreground">Monitor transactions and generate financial reports</p>
        </div>
    
      </div>

      {/* Summary Cards with live data */}
      <div className="grid gap-3 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. {summaryStats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From all successful transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.completedTransactions}</div>
            <p className="text-xs text-muted-foreground">Total successful payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.pendingTransactions}</div>
            <p className="text-xs text-muted-foreground">Awaiting verification</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by user, email, transaction ID, or plan..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => { handleSearchChange(""); handleStatusChange("all"); }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table with Live Data */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions ({pagination.total})</CardTitle>
          <CardDescription>Latest payment transactions and their status.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Plan</TableHead> {/* CORRECTED: Was "Hike" */}
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell><div className="font-mono text-sm">{payment.transactionId}</div></TableCell>
                    <TableCell>
                      <div className="font-medium">{payment.user}</div>
                      <div className="text-sm text-muted-foreground">{payment.email}</div>
                    </TableCell>
                    <TableCell><div className="font-medium">{payment.plan}</div></TableCell>
                    <TableCell><div className="font-medium">Rs. {payment.amount}</div></TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell><Badge variant={getStatusColor(payment.status)}>{payment.status}</Badge></TableCell>
                    <TableCell>
                      <div>{payment.date}</div>
                      <div className="text-sm text-muted-foreground">{payment.time}</div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {!isLoading && !isError && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1 || isFetching}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => p + 1)}
              disabled={page === pagination.totalPages || isFetching}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// --- IMPROVEMENT: A dedicated skeleton component for the loading state ---
function PaymentsReportsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80 mt-2" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <Skeleton className="h-28" /><Skeleton className="h-28" />
        <Skeleton className="h-28" /><Skeleton className="h-28" />
      </div>
      <Skeleton className="h-20" />
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}