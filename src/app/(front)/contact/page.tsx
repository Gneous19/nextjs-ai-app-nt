import type { Metadata } from "next"
import { ContactForm } from "./contact-form"

export const metadata: Metadata = {
  title: "ติดต่อเรา",
  description: "ติดต่อเราผ่านแบบฟอร์ม",
}

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-12 md:py-20">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          ติดต่อเรา
        </h1>
        <p className="mt-3 text-muted-foreground">
          มีคำถามหรือข้อสงสัย? ส่งข้อความถึงเราได้ที่นี่
        </p>
      </div>
      <ContactForm />
    </main>
  )
}
