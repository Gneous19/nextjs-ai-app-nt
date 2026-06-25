import "dotenv/config"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { PrismaClient } from "../generated/prisma/client"

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!)
const prisma = new PrismaClient({ adapter })

const CUSTOMERS = [
  { name: "สมชาย ใจดี", address: "123/45 ถ.สุขุมวิท กรุงเทพฯ", phone: "0812345678" },
  { name: "วิชัย รักเรียน", address: "456 หมู่ 2 ต.สันทราย เชียงใหม่", phone: "0823456789" },
  { name: "ประภาส มั่งมี", address: "78/9 ถ.พระราม 4 กรุงเทพฯ", phone: "0834567890" },
  { name: "สมหญิง จริงใจ", address: "321 ถ.นิมมานเหมินทร์ เชียงใหม่", phone: "0845678901" },
  { name: "นภาลัย แซ่ลี้", address: "55/1 ต.ป่าตอง ภูเก็ต", phone: "0856789012" },
  { name: "ธนวัฒน์ สมบูรณ์", address: "88 ถ.พัทยากลาง ชลบุรี", phone: "0867890123" },
  { name: "กาญจนา พรหมมา", address: "12/3 ถ.ข้าวสาร กรุงเทพฯ", phone: "0878901234" },
  { name: "อนุชา วงษ์สว่าง", address: "99 หมู่ 5 ต.หาดใหญ่ สงขลา", phone: "0889012345" },
  { name: "รัตนา แสงทอง", address: "40 ถ.ราชดำเนิน กรุงเทพฯ", phone: "0890123456" },
  { name: "ประสิทธิ์ ไชยวงศ์", address: "17 หมู่ 3 ต.อ่าวนาง กระบี่", phone: "0801234567" },
]

const THAI_MONTH = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
]

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomDateInJune(): Date {
  const day = randomInt(1, 30)
  const hour = randomInt(8, 22)
  const minute = randomInt(0, 59)
  return new Date(2026, 5, day, hour, minute, 0, 0) // June = 5 (0-indexed)
}

function toThaiDate(d: Date): string {
  return `${d.getDate()} ${THAI_MONTH[d.getMonth()]} ${d.getFullYear() + 543}`
}

async function main() {
  console.log("🌾 เริ่ม Seed ข้อมูลจำลอง...\n")

  const products = await prisma.products.findMany()
  if (products.length === 0) {
    console.log("❌ ไม่พบสินค้าในฐานข้อมูล กรุณาเพิ่มสินค้าก่อน")
    await prisma.$disconnect()
    process.exit(1)
  }
  console.log(`📦 พบสินค้า ${products.length} รายการ`)

  const customerNames = CUSTOMERS.map((c) => c.name)
  let existingCustomers = await prisma.customers.findMany({
    where: { name: { in: customerNames } },
  })
  const existingNames = new Set(existingCustomers.map((c) => c.name))
  for (const c of CUSTOMERS) {
    if (!existingNames.has(c.name)) {
      await prisma.customers.create({ data: c })
    }
  }
  existingCustomers = await prisma.customers.findMany({
    where: { name: { in: customerNames } },
  })
  console.log(`👤 พร้อมลูกค้า ${existingCustomers.length} ราย`)

  const orderCountBeforeJune = await prisma.orders.count()
  console.log(`📋 ออเดอร์ก่อน seed: ${orderCountBeforeJune} รายการ\n`)

  let createdOrders = 0

  for (let i = 0; i < 20; i++) {
    const customer = randomPick(existingCustomers)
    const date = randomDateInJune()

    const itemCount = randomInt(1, 3)
    const orderItems: { product_id: number; quantity: number; price: number }[] = []
    let totalAmount = 0

    const picked = new Set<number>()
    for (let j = 0; j < itemCount; j++) {
      let product = randomPick(products)
      while (picked.has(product.id)) product = randomPick(products)
      picked.add(product.id)
      const qty = randomInt(1, 4)
      const price = Number(product.price) || 100
      orderItems.push({
        product_id: product.id,
        quantity: qty,
        price,
      })
      totalAmount += price * qty
    }

    const statuses: Array<"delivered" | "received" | "processing"> = [
      "delivered",
      "delivered",
      "delivered",
      "received",
      "processing",
    ]
    const status = randomPick(statuses)

    await prisma.orders.create({
      data: {
        date,
        customer_id: customer.id,
        status,
        total_amount: totalAmount,
        order_items: {
          create: orderItems,
        },
      },
    })

    createdOrders++
    console.log(
      `  ✓ ออเดอร์ #${i + 1} | ${toThaiDate(date)} | ${customer.name} | ${status} | ฿${totalAmount.toLocaleString()}`
    )
  }

  const orderCountAfter = await prisma.orders.count()
  console.log(`\n✅ สร้างออเดอร์ในเดือนมิถุนายน ${createdOrders} รายการ`)
  console.log(`📋 ออเดอร์หลัง seed: ${orderCountAfter} รายการ`)

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error("❌ Seed error:", e)
  prisma.$disconnect()
  process.exit(1)
})
