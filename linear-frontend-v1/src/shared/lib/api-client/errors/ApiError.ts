export interface FieldError {
  field: string
  message: string
}

export class ApiError extends Error {
  readonly code: string
  readonly status: number
  readonly details?: FieldError[]

  constructor(code: string, message: string, status: number, details?: FieldError[]) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
    this.details = details
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      status: this.status,
      details: this.details,
    }
  }
}
