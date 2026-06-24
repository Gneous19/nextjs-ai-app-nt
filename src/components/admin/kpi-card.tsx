import type { LucideIcon } from "lucide-react"

type KpiCardProps = {
  label: string
  value: string | number
  icon: LucideIcon
}

export function KpiCard({ label, value, icon: Icon }: KpiCardProps) {
  return (
    <div className="bg-card rounded-xl border p-4 flex items-center gap-4">
      <div className="shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground truncate">{label}</p>
        <p className="text-xl font-bold truncate">{value}</p>
      </div>
    </div>
  )
}

export function KpiCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border p-4 flex items-center gap-4 animate-pulse">
      <div className="shrink-0 h-10 w-10 rounded-lg bg-muted" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-4 w-20 bg-muted rounded" />
        <div className="h-6 w-24 bg-muted rounded" />
      </div>
    </div>
  )
}
