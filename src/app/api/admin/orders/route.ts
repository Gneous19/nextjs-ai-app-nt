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
    const limit = parseInt(searchParams.get("limit") || "5")

    const [orders, total] = await Promise.all([
      prisma.orders.findMany({
        take: limit,
        orderBy: { date: "desc" },
        include: {
          customers: { select: { name: true } },
        },
      }),
      prisma.orders.count(),
    ])

    const orderItems = orders.map((order) => ({
      id: order.id,
      customerName: order.customers?.name || "ไม่ระบุ",
      date: order.date
        ? order.date.toLocaleDateString("th-TH")
        : "-",
      totalAmount: Number(order.total_amount) || 0,
      status: order.status || "processing",
    }))

    return NextResponse.json({ orders: orderItems, total })
  } catch (error) {
    console.error("Orders error:", error)
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการโหลดข้อมูล" },
      { status: 500 }
    )
  }
}
