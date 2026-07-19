import { ApiError } from './ApiError'

const STATUS = 401
const CODE = 'UNAUTHORIZED'

export class UnauthorizedError extends ApiError {
  constructor(message = 'Invalid or expired token') {
    super(CODE, message, STATUS)
    this.name = 'UnauthorizedError'
  }
}
