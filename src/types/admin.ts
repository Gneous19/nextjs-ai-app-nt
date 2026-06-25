export type ApiResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export type AdminProductImage = {
  id: number
  imageName: string
}

export type AdminProduct = {
  id: string
  name: string
  description: string | null
  price: number
  categoryId: string
  categoryName: string
  productImages: AdminProductImage[]
}

export type CategoryOption = {
  id: string
  name: string
}
