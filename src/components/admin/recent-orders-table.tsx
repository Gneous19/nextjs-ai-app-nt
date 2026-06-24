import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"

type AdminOrderItem = {
  id: number
  customerName: string
  date: string
  totalAmount: number
  status: string
}

const priceFormatter = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 0,
})

const statusLabels: Record<string, string> = {
  delivered: "ส่งแล้ว",
  processing: "กำลังดำเนินการ",
  received: "ได้รับแล้ว",
}

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  delivered: "default",
  processing: "secondary",
  received: "outline",
}

type RecentOrdersTableProps = {
  orders: AdminOrderItem[]
  loading: boolean
  error: string | null
  onRetry: () => void
}

export function RecentOrdersTable({
  orders,
  loading,
  error,
  onRetry,
}: RecentOrdersTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Spinner className="h-6 w-6" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 border border-destructive/50 rounded-lg text-center">
        <p className="text-destructive mb-2">{error}</p>
        <Button variant="ghost" size="sm" onClick={onRetry}>
          ลองใหม่
        </Button>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        ไม่มีคำสั่งซื้อ
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>รหัส</TableHead>
          <TableHead>ลูกค้า</TableHead>
          <TableHead>วันที่</TableHead>
          <TableHead>ยอดรวม</TableHead>
          <TableHead>สถานะ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>#{order.id}</TableCell>
            <TableCell>{order.customerName}</TableCell>
            <TableCell>{order.date}</TableCell>
            <TableCell>{priceFormatter.format(order.totalAmount)}</TableCell>
            <TableCell>
              <Badge
                variant={statusVariant[order.status] || "secondary"}
              >
                {statusLabels[order.status] || order.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
