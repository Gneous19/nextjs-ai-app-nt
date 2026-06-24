"use client"

import { useState, useEffect, useCallback } from "react"
import dynamic from "next/dynamic"
import { DollarSign, ShoppingCart, Clock, Package, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { KpiCard, KpiCardSkeleton } from "@/components/admin/kpi-card"
import { PeriodSelector } from "@/components/admin/period-selector"
import { RecentOrdersTable } from "@/components/admin/recent-orders-table"

const RevenueChart = dynamic(
  () => import("@/components/admin/revenue-chart").then((m) => m.RevenueChart),
  { ssr: false }
)

type AdminStats = {
  todaySales: number
  todayOrders: number
  pendingOrders: number
  totalProducts: number
  totalUsers: number
}

type RevenuePoint = {
  date: string
  revenue: number
  orders: number
}

type AdminOrderItem = {
  id: number
  customerName: string
  date: string
  totalAmount: number
  status: string
}

const priceFormatter = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 0,
})

export function DashboardClient() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState<string | null>(null)

  const [revenue, setRevenue] = useState<RevenuePoint[]>([])
  const [revenueLoading, setRevenueLoading] = useState(false)

  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d")

  const [orders, setOrders] = useState<AdminOrderItem[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setStatsError(null)
      const res = await fetch("/api/admin/stats")
      const json = await res.json()
      if (!res.ok) {
        setStatsError(json.error || "เกิดข้อผิดพลาดในการโหลดข้อมูล")
        return
      }
      setStats(json)
    } catch {
      setStatsError("เกิดข้อผิดพลาดในการโหลดข้อมูล")
    } finally {
      setStatsLoading(false)
    }
  }, [])

  const fetchRevenue = useCallback(async (p: string) => {
    try {
      setRevenueLoading(true)
      const res = await fetch(`/api/admin/revenue?period=${p}`)
      const json = await res.json()
      if (res.ok) setRevenue(json)
    } catch {
      // silent
    } finally {
      setRevenueLoading(false)
    }
  }, [])

  const fetchOrders = useCallback(async () => {
    try {
      setOrdersError(null)
      const res = await fetch("/api/admin/orders?limit=5")
      const json = await res.json()
      if (!res.ok) {
        setOrdersError(json.error || "เกิดข้อผิดพลาดในการโหลดข้อมูล")
        return
      }
      setOrders(json.orders)
    } catch {
      setOrdersError("เกิดข้อผิดพลาดในการโหลดข้อมูล")
    } finally {
      setOrdersLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats()
    fetchOrders()
  }, [fetchStats, fetchOrders])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRevenue(period)
  }, [period, fetchRevenue])

  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats()
      fetchOrders()
    }, 30_000)
    return () => clearInterval(interval)
  }, [fetchStats, fetchOrders])

  const kpiItems: { label: string; value: string | number; icon: LucideIcon }[] = stats
    ? [
        { label: "ยอดขายวันนี้", value: priceFormatter.format(stats.todaySales), icon: DollarSign },
        { label: "คำสั่งซื้อวันนี้", value: stats.todayOrders, icon: ShoppingCart },
        { label: "รอดำเนินการ", value: stats.pendingOrders, icon: Clock },
        { label: "สินค้าทั้งหมด", value: stats.totalProducts, icon: Package },
        { label: "ผู้ใช้ทั้งหมด", value: stats.totalUsers, icon: Users },
      ]
    : []

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {statsError && (
        <div className="mb-6 p-4 border border-destructive/50 rounded-lg text-center">
          <p className="text-destructive mb-2">{statsError}</p>
          <Button variant="ghost" size="sm" onClick={fetchStats}>
            ลองใหม่
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {statsLoading
          ? Array.from({ length: 5 }).map((_, i) => <KpiCardSkeleton key={i} />)
          : !statsError &&
              kpiItems.map((item, i) => <KpiCard key={i} {...item} />)}
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">รายได้</h2>
          <PeriodSelector
            value={period}
            onChange={(v) => setPeriod(v as "7d" | "30d" | "90d")}
          />
        </div>
        <div className="bg-card rounded-xl border p-4">
          {revenueLoading ? (
            <div className="flex items-center justify-center h-64">
              <Spinner className="h-8 w-8" />
            </div>
          ) : (
            <RevenueChart data={revenue} />
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">คำสั่งซื้อล่าสุด</h2>
        <RecentOrdersTable
          orders={orders}
          loading={ordersLoading}
          error={ordersError}
          onRetry={fetchOrders}
        />
      </div>
    </main>
  )
}
