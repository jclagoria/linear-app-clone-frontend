import { ApiError } from './ApiError'

const STATUS = 404
const CODE = 'NOT_FOUND'

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(CODE, message, STATUS)
    this.name = 'NotFoundError'
  }
}
