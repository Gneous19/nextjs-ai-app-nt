export type ApiResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export type AdminProduct = {
  id: string
  name: string
  description: string | null
  price: number
  categoryId: string
  categoryName: string
}

export type CategoryOption = {
  id: string
  name: string
}
