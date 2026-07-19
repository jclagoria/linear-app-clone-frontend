import { ApiError } from './ApiError'

const STATUS = 500
const CODE = 'SERVER_ERROR'

export class InternalError extends ApiError {
  constructor(message = 'Something went wrong. Please try again.') {
    super(CODE, message, STATUS)
    this.name = 'InternalError'
  }
}
