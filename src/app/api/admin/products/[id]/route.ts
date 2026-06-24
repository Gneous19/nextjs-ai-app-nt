import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { productSchema } from "@/lib/validations/product"
import type { ApiResponse, AdminProduct } from "@/types/admin"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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
    const { id } = await params
    const productId = parseInt(id)

    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: "รหัสสินค้าไม่ถูกต้อง" } satisfies ApiResponse<never>,
        { status: 400 }
      )
    }

    const existing = await prisma.products.findUnique({ where: { id: productId } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "ไม่พบสินค้า" } satisfies ApiResponse<never>,
        { status: 404 }
      )
    }

    const body = await request.json()
    const result = productSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง",
        } satisfies ApiResponse<never>,
        { status: 400 }
      )
    }

    const { name, description, price, categoryId } = result.data

    const product = await prisma.products.update({
      where: { id: productId },
      data: {
        name,
        description: description || null,
        price,
        category_id: parseInt(categoryId),
      },
      include: {
        categories: { select: { id: true, name: true } },
      },
    })

    const serialized: AdminProduct = {
      id: String(product.id),
      name: product.name ?? "",
      description: product.description,
      price: Number(product.price ?? 0),
      categoryId: product.category_id !== null ? String(product.category_id) : "",
      categoryName: product.categories?.name ?? "ไม่ระบุหมวดหมู่",
    }

    return NextResponse.json(
      { success: true, data: { product: serialized } } satisfies ApiResponse<{ product: AdminProduct }>
    )
  } catch (error) {
    console.error("Product update error:", error)
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดในการแก้ไขสินค้า" } satisfies ApiResponse<never>,
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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
    const { id } = await params
    const productId = parseInt(id)

    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: "รหัสสินค้าไม่ถูกต้อง" } satisfies ApiResponse<never>,
        { status: 400 }
      )
    }

    const existing = await prisma.products.findUnique({ where: { id: productId } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "ไม่พบสินค้า" } satisfies ApiResponse<never>,
        { status: 404 }
      )
    }

    const orderItemCount = await prisma.order_items.count({
      where: { product_id: productId },
    })

    if (orderItemCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `ไม่สามารถลบสินค้าได้ เนื่องจากมีรายการสั่งซื้อที่เกี่ยวข้อง ${orderItemCount} รายการ`,
        } satisfies ApiResponse<never>,
        { status: 409 }
      )
    }

    await prisma.products.delete({ where: { id: productId } })

    return NextResponse.json(
      { success: true, data: null } satisfies ApiResponse<null>
    )
  } catch (error) {
    console.error("Product delete error:", error)
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดในการลบสินค้า" } satisfies ApiResponse<never>,
      { status: 500 }
    )
  }
}
