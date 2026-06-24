"use client"

import { useState, useEffect, useCallback } from "react"
import { toast, Toaster } from "sonner"
import { RiAddLine, RiPencilLine, RiDeleteBinLine } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ProductFormModal } from "./product-form-modal"
import { DeleteConfirmDialog } from "./delete-confirm-dialog"
import type { AdminProduct, CategoryOption } from "@/types/admin"

const priceFormatter = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 2,
})

export function ProductsClient() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1)
  const [inputVal, setInputVal] = useState("")
  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      params.set("page", String(page))

      const res = await fetch(`/api/admin/products?${params}`)
      const json = await res.json()

      if (!json.success) {
        toast.error(json.error || "เกิดข้อผิดพลาดในการโหลดข้อมูล")
        return
      }

      setProducts(json.data.products)
      setTotal(json.data.total)
      setTotalPages(json.data.totalPages)
    } catch {
      toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล")
    } finally {
      setLoading(false)
    }
  }, [search, page])

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/categories")
      const json = await res.json()

      if (json.success) {
        setCategories(json.data)
      }
    } catch {
      // silent
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(inputVal)
      setPage(1)
    }, 300)
    return () => clearTimeout(t)
  }, [inputVal])

  function handlePageChange(newPage: number) {
    if (newPage < 1 || newPage > totalPages) return
    setPage(newPage)
  }

  function openCreate() {
    setEditProduct(null)
    setFormOpen(true)
  }

  function openEdit(product: AdminProduct) {
    setEditProduct(product)
    setFormOpen(true)
  }

  function handleSaved() {
    setFormOpen(false)
    setEditProduct(null)
    fetchProducts()
  }

  function handleDeleted() {
    setDeleteTarget(null)
    fetchProducts()
  }

  function getPageNumbers(): number[] {
    const pages: number[] = []
    const start = Math.max(1, page - 2)
    const end = Math.min(totalPages, page + 2)
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Toaster richColors position="top-center" />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">จัดการสินค้า</h1>
        <Button onClick={openCreate}>
          <RiAddLine className="h-4 w-4" />
          เพิ่มสินค้า
        </Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="ค้นหาสินค้า..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <Spinner className="h-8 w-8" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {search ? "ไม่พบสินค้าที่ค้นหา" : "ยังไม่มีสินค้า"}
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">#</TableHead>
                  <TableHead>ชื่อสินค้า</TableHead>
                  <TableHead>หมวดหมู่</TableHead>
                  <TableHead className="text-right">ราคา</TableHead>
                  <TableHead className="w-[120px] text-right">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {product.id}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{product.name}</div>
                      {product.description && (
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {product.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{product.categoryName}</TableCell>
                    <TableCell className="text-right">
                      {priceFormatter.format(product.price)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEdit(product)}
                        >
                          <RiPencilLine className="h-4 w-4" />
                          <span className="sr-only">แก้ไข</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleteTarget(product)}
                        >
                          <RiDeleteBinLine className="h-4 w-4 text-destructive" />
                          <span className="sr-only">ลบ</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button
                variant="ghost"
                size="sm"
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
              >
                ก่อนหน้า
              </Button>
              {getPageNumbers().map((p) => (
                <Button
                  key={p}
                  variant={p === page ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handlePageChange(p)}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                ถัดไป
              </Button>
            </div>
          )}

          <div className="text-center text-sm text-muted-foreground mt-2">
            ทั้งหมด {total} รายการ
          </div>
        </>
      )}

      <ProductFormModal
        open={formOpen}
        product={editProduct}
        categories={categories}
        onClose={() => {
          setFormOpen(false)
          setEditProduct(null)
        }}
        onSaved={handleSaved}
      />

      <DeleteConfirmDialog
        open={deleteTarget !== null}
        product={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={handleDeleted}
      />
    </main>
  )
}
