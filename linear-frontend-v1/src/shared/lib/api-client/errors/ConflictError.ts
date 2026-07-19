import { ApiError } from './ApiError'

const STATUS = 409
const CODE = 'CONFLICT'

export class ConflictError extends ApiError {
  constructor(message = 'Resource conflict') {
    super(CODE, message, STATUS)
    this.name = 'ConflictError'
  }
}
