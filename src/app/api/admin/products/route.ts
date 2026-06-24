import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { productSchema } from "@/lib/validations/product"
import type { ApiResponse, AdminProduct } from "@/types/admin"

export async function GET(request: Request) {
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
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const pageSize = 10

    const where = search
      ? { name: { contains: search } }
      : {}

    const [products, total] = await Promise.all([
      prisma.products.findMany({
        where,
        include: {
          categories: { select: { id: true, name: true } },
        },
        orderBy: { id: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.products.count({ where }),
    ])

    const serialized: AdminProduct[] = products.map((p) => ({
      id: String(p.id),
      name: p.name ?? "",
      description: p.description,
      price: Number(p.price ?? 0),
      categoryId: p.category_id !== null ? String(p.category_id) : "",
      categoryName: p.categories?.name ?? "ไม่ระบุหมวดหมู่",
    }))

    return NextResponse.json({
      success: true,
      data: {
        products: serialized,
        total,
        page,
        totalPages: Math.ceil(total / pageSize),
      },
    } satisfies ApiResponse<{
      products: AdminProduct[]
      total: number
      page: number
      totalPages: number
    }>)
  } catch (error) {
    console.error("Products list error:", error)
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดในการโหลดข้อมูล" } satisfies ApiResponse<never>,
      { status: 500 }
    )
  }
}

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

    const product = await prisma.products.create({
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
      { success: true, data: { product: serialized } } satisfies ApiResponse<{ product: AdminProduct }>,
      { status: 201 }
    )
  } catch (error) {
    console.error("Product create error:", error)
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดในการสร้างสินค้า" } satisfies ApiResponse<never>,
      { status: 500 }
    )
  }
}
