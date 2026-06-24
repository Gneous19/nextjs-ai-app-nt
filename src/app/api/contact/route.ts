import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { contactSchema } from '@/lib/validations/contact'

type ApiResponse<T> = { success: true; data: T } | { success: false; error: string }

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = contactSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0]?.message || 'ข้อมูลไม่ถูกต้อง' } satisfies ApiResponse<never>,
        { status: 400 }
      )
    }

    const { name, email, message } = result.data

    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || 'noreply@example.com',
      to: process.env.CONTACT_RECEIVER_EMAIL!,
      subject: `ข้อความจาก ${name}`,
      html: `
        <h3>ข้อความติดต่อ</h3>
        <p><strong>ชื่อ:</strong> ${name}</p>
        <p><strong>อีเมล:</strong> ${email}</p>
        <p><strong>ข้อความ:</strong></p>
        <p>${message}</p>
      `,
    })

    return NextResponse.json({ success: true, data: { message: 'ส่งข้อความสำเร็จ' } } satisfies ApiResponse<{ message: string }>)
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' } satisfies ApiResponse<never>,
      { status: 500 }
    )
  }
}
