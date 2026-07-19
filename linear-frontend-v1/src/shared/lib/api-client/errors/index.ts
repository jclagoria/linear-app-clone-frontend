export { ApiError } from './ApiError'
export { ValidationError } from './ValidationError'
export { UnauthorizedError } from './UnauthorizedError'
export { ForbiddenError } from './ForbiddenError'
export { NotFoundError } from './NotFoundError'
export { ConflictError } from './ConflictError'
export { BusinessRuleError } from './BusinessRuleError'
export { RateLimitError } from './RateLimitError'
export { InternalError } from './InternalError'

export {
  isValidationError,
  isUnauthorizedError,
  isForbiddenError,
  isNotFoundError,
  isConflictError,
  isBusinessRuleError,
  isRateLimitError,
  isInternalError,
  isApiError,
} from './typeGuards'

export type { FieldError } from './ApiError'
