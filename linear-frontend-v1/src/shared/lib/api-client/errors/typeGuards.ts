import { ApiError } from './ApiError'
import { ValidationError } from './ValidationError'
import { UnauthorizedError } from './UnauthorizedError'
import { ForbiddenError } from './ForbiddenError'
import { NotFoundError } from './NotFoundError'
import { ConflictError } from './ConflictError'
import { BusinessRuleError } from './BusinessRuleError'
import { RateLimitError } from './RateLimitError'
import { InternalError } from './InternalError'

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError
}

export function isUnauthorizedError(error: unknown): error is UnauthorizedError {
  return error instanceof UnauthorizedError
}

export function isForbiddenError(error: unknown): error is ForbiddenError {
  return error instanceof ForbiddenError
}

export function isNotFoundError(error: unknown): error is NotFoundError {
  return error instanceof NotFoundError
}

export function isConflictError(error: unknown): error is ConflictError {
  return error instanceof ConflictError
}

export function isBusinessRuleError(error: unknown): error is BusinessRuleError {
  return error instanceof BusinessRuleError
}

export function isRateLimitError(error: unknown): error is RateLimitError {
  return error instanceof RateLimitError
}

export function isInternalError(error: unknown): error is InternalError {
  return error instanceof InternalError
}
