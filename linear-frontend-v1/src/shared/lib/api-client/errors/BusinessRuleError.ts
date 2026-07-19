import { ApiError } from './ApiError'

const STATUS = 422
const CODE = 'BUSINESS_RULE_ERROR'

export class BusinessRuleError extends ApiError {
  constructor(message = 'Business rule violation') {
    super(CODE, message, STATUS)
    this.name = 'BusinessRuleError'
  }
}
