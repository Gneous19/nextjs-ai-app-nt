import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
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
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const [todayOrders, todaySalesResult, pendingOrders, totalProducts, totalUsers] =
      await Promise.all([
        prisma.orders.count({
          where: { date: { gte: today, lt: tomorrow } },
        }),
        prisma.orders.aggregate({
          where: { date: { gte: today, lt: tomorrow } },
          _sum: { total_amount: true },
        }),
        prisma.orders.count({ where: { status: "processing" } }),
        prisma.products.count(),
        prisma.user.count(),
      ])

    return NextResponse.json({
      todaySales: Number(todaySalesResult._sum.total_amount) || 0,
      todayOrders,
      pendingOrders,
      totalProducts,
      totalUsers,
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการโหลดข้อมูล" },
      { status: 500 }
    )
  }
}
