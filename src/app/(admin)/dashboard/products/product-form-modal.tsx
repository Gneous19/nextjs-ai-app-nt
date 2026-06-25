"use client"

import { useEffect, useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from 'zod/v4'
import { RiCloseLine, RiImageAddLine } from "@remixicon/react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { productSchema } from "@/lib/validations/product"
import type { AdminProduct, AdminProductImage, CategoryOption } from "@/types/admin"

type Props = {
  open: boolean
  product: AdminProduct | null
  categories: CategoryOption[]
  onClose: () => void
  onSaved: () => void
}

type FormValues = z.input<typeof productSchema>

const defaultValues: FormValues = {
  name: "",
  description: "",
  price: undefined,
  categoryId: "",
}

export function ProductFormModal({
  open,
  product,
  categories,
  onClose,
  onSaved,
}: Props) {
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<AdminProductImage[]>([])
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
  })

  useEffect(() => {
    if (open) {
      form.reset(
        product
          ? {
              name: product.name,
              description: product.description ?? "",
              price: product.price,
              categoryId: product.categoryId,
            }
          : defaultValues
      )
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImages(product?.productImages ?? [])
      setRemovedImageIds([])
    }
  }, [open, product, form])

  const isEdit = product !== null

  async function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    for (const file of Array.from(files)) {
      try {
        const fd = new FormData()
        fd.append("file", file)
        const res = await fetch("/api/admin/products/images", { method: "POST", body: fd })
        const json = await res.json()
        if (json.success) {
          setImages((prev) => [...prev, { id: 0, imageName: json.data.imageName }])
        } else {
          toast.error(json.error || "อัปโหลดไม่สำเร็จ")
        }
      } catch {
        toast.error("อัปโหลดไม่สำเร็จ")
      }
    }
    setUploading(false)
    e.target.value = ""
  }

  function removeNewImage(imageName: string) {
    setImages((prev) => prev.filter((img) => img.imageName !== imageName))
  }

  function removeExistingImage(imageId: number) {
    setImages((prev) => prev.filter((img) => img.id !== imageId))
    setRemovedImageIds((prev) => [...prev, imageId])
  }

  async function onSubmit(data: FormValues) {
    setSubmitting(true)
    try {
      const url = isEdit
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products"

      const method = isEdit ? "PUT" : "POST"

      const pendingImages = images.filter((img) => img.id === 0).map((img) => img.imageName)

      const payload = {
        ...data,
        images: pendingImages,
        ...(isEdit && { removedImages: removedImageIds }),
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const json = await res.json()

      if (!json.success) {
        toast.error(json.error || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง")
        return
      }

      toast.success(isEdit ? "แก้ไขสินค้าสำเร็จ" : "เพิ่มสินค้าสำเร็จ")
      onSaved()
    } catch {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง")
    } finally {
      setSubmitting(false)
    }
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) onClose()
  }

  const isProcessing = submitting || uploading

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={!isProcessing} className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "แก้ไขข้อมูลสินค้าด้านล่าง"
              : "กรอกข้อมูลสินค้าใหม่ด้านล่าง"}
          </DialogDescription>
        </DialogHeader>

        <form
          id="form-product"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-product-name">ชื่อสินค้า</FieldLabel>
                  <Input
                    {...field}
                    id="form-product-name"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="กรอกชื่อสินค้า"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-product-description">
                    รายละเอียด
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="form-product-description"
                    aria-invalid={fieldState.invalid}
                    placeholder="รายละเอียดสินค้า (ไม่จำเป็น)"
                    rows={3}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-product-price">ราคา</FieldLabel>
                  <Input
                    id="form-product-price"
                    type="number"
                    aria-invalid={fieldState.invalid}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    name={field.name}
                    ref={field.ref}
                    value={
                      field.value === undefined || field.value === null
                        ? ""
                        : String(field.value)
                    }
                    onChange={(e) => {
                      const val = e.target.value
                      field.onChange(val === "" ? undefined : val)
                    }}
                    onBlur={field.onBlur}
                    disabled={field.disabled}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="categoryId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-product-category">
                    หมวดหมู่
                  </FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="form-product-category"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="เลือกหมวดหมู่" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <div className="mt-4">
            <FieldLabel>รูปภาพสินค้า</FieldLabel>
            <div className="mt-2 flex flex-wrap gap-3">
              {images.map((img) => (
                <div
                  key={img.id !== 0 ? `existing-${img.id}` : `new-${img.imageName}`}
                  className="relative h-20 w-20 overflow-hidden rounded-md border"
                >
                  <Image
                    src={`/product-image/${img.imageName}`}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      img.id !== 0
                        ? removeExistingImage(img.id)
                        : removeNewImage(img.imageName)
                    }
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                    disabled={isProcessing}
                  >
                    <RiCloseLine className="h-3 w-3" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-md border border-dashed text-muted-foreground hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? (
                  <Spinner className="h-5 w-5" />
                ) : (
                  <RiImageAddLine className="h-5 w-5" />
                )}
                <span className="text-[10px]">เพิ่มรูป</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                className="hidden"
                onChange={handleFilesSelected}
              />
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isProcessing}
          >
            ยกเลิก
          </Button>
          <Button
            type="submit"
            form="form-product"
            disabled={isProcessing}
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                กำลังบันทึก...
              </span>
            ) : isEdit ? (
              "บันทึก"
            ) : (
              "เพิ่มสินค้า"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
