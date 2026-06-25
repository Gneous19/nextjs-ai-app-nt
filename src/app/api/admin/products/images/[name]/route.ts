import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { unlink } from "fs/promises"
import { join } from "path"
import { auth } from "@/lib/auth"
import type { ApiResponse } from "@/types/admin"

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
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
    const { name } = await params

    if (!name || name.includes("..") || name.includes("/") || name.includes("\\")) {
      return NextResponse.json(
        { success: false, error: "ชื่อไฟล์ไม่ถูกต้อง" } satisfies ApiResponse<never>,
        { status: 400 }
      )
    }

    const filePath = join(process.cwd(), "public", "product-image", name)
    await unlink(filePath)

    return NextResponse.json(
      { success: true, data: null } satisfies ApiResponse<null>
    )
  } catch (error) {
    console.error("Image delete error:", error)
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดในการลบรูปภาพ" } satisfies ApiResponse<never>,
      { status: 500 }
    )
  }
}
