import { ApiError } from './ApiError'

const STATUS = 403
const CODE = 'FORBIDDEN'

export class ForbiddenError extends ApiError {
  constructor(message = 'You do not have permission to perform this action') {
    super(CODE, message, STATUS)
    this.name = 'ForbiddenError'
  }
}
