import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (session.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "30d"
    const days = period === "7d" ? 7 : period === "90d" ? 90 : 30

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    startDate.setHours(0, 0, 0, 0)

    const orders = await prisma.orders.findMany({
      where: { date: { gte: startDate } },
      select: { date: true, total_amount: true },
      orderBy: { date: "asc" },
    })

    const grouped = new Map<
      string,
      { date: string; revenue: number; orders: number }
    >()

    for (const order of orders) {
      if (!order.date) continue
      const key = order.date.toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "2-digit",
      })
      const existing = grouped.get(key)
      if (existing) {
        existing.revenue += Number(order.total_amount) || 0
        existing.orders += 1
      } else {
        grouped.set(key, {
          date: key,
          revenue: Number(order.total_amount) || 0,
          orders: 1,
        })
      }
    }

    const data = Array.from(grouped.values())

    return NextResponse.json(data)
  } catch (error) {
    console.error("Revenue error:", error)
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการโหลดข้อมูล" },
      { status: 500 }
    )
  }
}
