export type ApiResponse = {
  status: "success" | "error"
  message: string
}

export type ApiResponseWithData<T> = ApiResponse & {
  data?: T
}
