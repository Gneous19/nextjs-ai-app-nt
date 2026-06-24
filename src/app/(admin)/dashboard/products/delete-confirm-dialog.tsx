"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Spinner } from "@/components/ui/spinner"
import type { AdminProduct } from "@/types/admin"

type Props = {
  open: boolean
  product: AdminProduct | null
  onClose: () => void
  onDeleted: () => void
}

export function DeleteConfirmDialog({
  open,
  product,
  onClose,
  onDeleted,
}: Props) {
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!product) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      })

      const json = await res.json()

      if (!json.success) {
        toast.error(json.error || "เกิดข้อผิดพลาดในการลบสินค้า")
        onClose()
        return
      }

      toast.success("ลบสินค้าสำเร็จ")
      onDeleted()
    } catch {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง")
      onClose()
    } finally {
      setDeleting(false)
    }
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen && !deleting) onClose()
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>ยืนยันการลบสินค้า</AlertDialogTitle>
          <AlertDialogDescription>
            คุณต้องการลบสินค้า <strong>{product?.name}</strong> ใช่หรือไม่?
            การดำเนินการนี้ไม่สามารถเรียกคืนได้
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>ยกเลิก</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <span className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                กำลังลบ...
              </span>
            ) : (
              "ลบสินค้า"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
