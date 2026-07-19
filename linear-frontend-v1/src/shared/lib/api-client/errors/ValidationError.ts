import { ApiError, type FieldError } from './ApiError'

const STATUS = 400
const CODE = 'VALIDATION_ERROR'

export class ValidationError extends ApiError {
  declare readonly details: FieldError[]

  constructor(message: string, details: FieldError[] = []) {
    super(CODE, message, STATUS, details)
    this.name = 'ValidationError'
  }
}
