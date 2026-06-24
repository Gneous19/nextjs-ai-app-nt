"use client"

import { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Mail, Phone, Clock, CheckCircle } from "lucide-react"
import { toast, Toaster } from "sonner"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { contactSchema, type ContactFormValues } from "@/lib/validations/contact"

export function ContactForm() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  function onSubmit(data: ContactFormValues) {
    startTransition(async () => {
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })

        const json = await res.json()

        if (!json.success) {
          toast.error(json.error || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง")
          return
        }

        form.reset()
        setIsSuccess(true)
      } catch {
        toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง")
      }
    })
  }

  if (isSuccess) {
    return (
      <>
        <Toaster richColors position="top-center" />
        <div className="flex flex-col items-center text-center gap-4 py-8">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <h2 className="text-2xl font-semibold">ส่งข้อความสำเร็จ</h2>
          <p className="text-muted-foreground max-w-md">
            ขอบคุณสำหรับข้อความ เราจะติดต่อกลับโดยเร็วที่สุด
          </p>
          <Button
            variant="ghost"
            onClick={() => setIsSuccess(false)}
          >
            ส่งข้อความอีกครั้ง
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <Toaster richColors position="top-center" />
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-8 md:gap-12 max-w-5xl mx-auto">
        <div>
          <h2 className="text-xl font-semibold mb-6">ข้อมูลติดต่อ</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail className="h-5 w-5 shrink-0" />
              <span>contact@example.com</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Phone className="h-5 w-5 shrink-0" />
              <span>02-XXX-XXXX</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Clock className="h-5 w-5 shrink-0" />
              <span>จันทร์ - ศุกร์ 9:00 - 18:00 น.</span>
            </div>
          </div>
          <Separator className="my-6" />
          <p className="text-muted-foreground text-sm leading-relaxed">
            หากคุณมีข้อสงสัยหรือต้องการสอบถามข้อมูลเพิ่มเติม
            สามารถติดต่อเราผ่านแบบฟอร์มด้านข้าง หรือช่องทางที่ระบุไว้
            ทีมงานของเราพร้อมให้บริการและจะตอบกลับโดยเร็วที่สุด
          </p>
        </div>

        <div>
          <form
            id="form-contact"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-contact-name">ชื่อ</FieldLabel>
                    <Input
                      {...field}
                      id="form-contact-name"
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="กรอกชื่อของคุณ"
                      autoComplete="name"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-contact-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="form-contact-email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="example@email.com"
                      autoComplete="email"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="message"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-contact-message">ข้อความ</FieldLabel>
                    <Textarea
                      {...field}
                      id="form-contact-message"
                      aria-invalid={fieldState.invalid}
                      placeholder="พิมพ์ข้อความที่ต้องการ..."
                      rows={5}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
          <Button
            type="submit"
            form="form-contact"
            className="w-full mt-6"
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                กำลังส่ง...
              </span>
            ) : (
              "ส่งข้อความ"
            )}
          </Button>
        </div>
      </div>
    </>
  )
}
