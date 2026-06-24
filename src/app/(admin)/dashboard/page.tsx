import { Suspense } from "react"
import { DashboardClient } from "./dashboard-client"

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]">Loading...</div>}>
      <DashboardClient />
    </Suspense>
  )
}
