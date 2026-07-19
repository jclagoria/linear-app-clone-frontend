import { ApiError } from './ApiError'

const STATUS = 429
const CODE = 'RATE_LIMITED'

export class RateLimitError extends ApiError {
  readonly retryAfter: number

  constructor(message: string, retryAfter: number) {
    super(CODE, message, STATUS)
    this.name = 'RateLimitError'
    this.retryAfter = retryAfter
  }
}
