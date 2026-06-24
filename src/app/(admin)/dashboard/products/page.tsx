import { Suspense } from "react"
import { ProductsClient } from "./products-client"

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]">Loading...</div>}>
      <ProductsClient />
    </Suspense>
  )
}
