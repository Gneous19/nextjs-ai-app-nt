import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import type { ApiResponse, CategoryOption } from "@/types/admin"

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" } satisfies ApiResponse<never>,
      { status: 401 }
    )
  }

  if (session.user?.role !== "admin") {
    return NextResponse.json(
      { success: false, error: "Forbidden" } satisfies ApiResponse<never>,
      { status: 403 }
    )
  }

  try {
    const categories = await prisma.categories.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    })

    const serialized: CategoryOption[] = categories.map((c) => ({
      id: String(c.id),
      name: c.name ?? "ไม่ระบุหมวดหมู่",
    }))

    return NextResponse.json({
      success: true,
      data: serialized,
    } satisfies ApiResponse<CategoryOption[]>)
  } catch (error) {
    console.error("Categories error:", error)
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดในการโหลดข้อมูล" } satisfies ApiResponse<never>,
      { status: 500 }
    )
  }
}
