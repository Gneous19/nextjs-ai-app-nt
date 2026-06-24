import { Button } from "@/components/ui/button"

type Period = "7d" | "30d" | "90d"

type PeriodSelectorProps = {
  value: Period
  onChange: (value: Period) => void
}

const periods: { value: Period; label: string }[] = [
  { value: "7d", label: "7 วัน" },
  { value: "30d", label: "30 วัน" },
  { value: "90d", label: "90 วัน" },
]

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="flex gap-1 bg-muted rounded-lg p-1">
      {periods.map((p) => (
        <Button
          key={p.value}
          variant={value === p.value ? "default" : "ghost"}
          size="sm"
          onClick={() => onChange(p.value)}
        >
          {p.label}
        </Button>
      ))}
    </div>
  )
}
