"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from 'zod/v4'

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
import type { AdminProduct, CategoryOption } from "@/types/admin"

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
    }
  }, [open, product, form])

  const isEdit = product !== null

  async function onSubmit(data: FormValues) {
    setSubmitting(true)
    try {
      const url = isEdit
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products"

      const method = isEdit ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={!submitting}>
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
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={submitting}
          >
            ยกเลิก
          </Button>
          <Button
            type="submit"
            form="form-product"
            disabled={submitting}
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
