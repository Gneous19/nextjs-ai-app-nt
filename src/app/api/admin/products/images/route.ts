import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { writeFile } from "fs/promises"
import { join } from "path"
import { auth } from "@/lib/auth"
import type { ApiResponse } from "@/types/admin"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"]
const MAX_SIZE = 5 * 1024 * 1024

export async function POST(request: Request) {
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
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { success: false, error: "กรุณาเลือกไฟล์รูปภาพ" } satisfies ApiResponse<never>,
        { status: 400 }
      )
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "รองรับเฉพาะไฟล์ JPEG, PNG, WebP และ AVIF" } satisfies ApiResponse<never>,
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "ขนาดไฟล์ต้องไม่เกิน 5 MB" } satisfies ApiResponse<never>,
        { status: 400 }
      )
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const filename = `${crypto.randomUUID()}.${ext}`

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = join(process.cwd(), "public", "product-image")
    await writeFile(join(uploadDir, filename), buffer)

    return NextResponse.json(
      { success: true, data: { imageName: filename } } satisfies ApiResponse<{ imageName: string }>
    )
  } catch (error) {
    console.error("Image upload error:", error)
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ" } satisfies ApiResponse<never>,
      { status: 500 }
    )
  }
}
