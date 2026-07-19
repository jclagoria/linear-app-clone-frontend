import type {
  ApiError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  BusinessRuleError,
  RateLimitError,
  InternalError,
} from './errors'

import {
  isApiError,
  isValidationError,
  isUnauthorizedError,
  isForbiddenError,
  isNotFoundError,
  isConflictError,
  isBusinessRuleError,
  isRateLimitError,
  isInternalError,
} from './errors/typeGuards'

export interface ErrorHandler {
  onValidationError?: (error: ValidationError) => void
  onUnauthorized?: (error: UnauthorizedError) => void
  onForbidden?: (error: ForbiddenError) => void
  onNotFound?: (error: NotFoundError) => void
  onConflict?: (error: ConflictError) => void
  onBusinessRuleError?: (error: BusinessRuleError) => void
  onRateLimited?: (error: RateLimitError) => void
  onServerError?: (error: InternalError) => void
  onNetworkError?: (error: ApiError) => void
  onUnknown?: (error: unknown) => void
}

type Guard = (error: unknown) => boolean

const dispatchTable: Array<{ guard: Guard; handler: keyof ErrorHandler }> = [
  { guard: isValidationError, handler: 'onValidationError' },
  { guard: isUnauthorizedError, handler: 'onUnauthorized' },
  { guard: isForbiddenError, handler: 'onForbidden' },
  { guard: isNotFoundError, handler: 'onNotFound' },
  { guard: isConflictError, handler: 'onConflict' },
  { guard: isBusinessRuleError, handler: 'onBusinessRuleError' },
  { guard: isRateLimitError, handler: 'onRateLimited' },
  { guard: isInternalError, handler: 'onServerError' },
  { guard: isApiError, handler: 'onNetworkError' },
]

function dispatchToHandler(
  handler: ErrorHandler,
  error: unknown,
): void {
  if (!(error instanceof Error)) {
    handler.onUnknown?.(error)
    return
  }

  const entry = dispatchTable.find(({ guard }) => guard(error))
  if (entry) {
    ;(handler[entry.handler] as (...args: unknown[]) => void)?.(error)
    return
  }

  handler.onUnknown?.(error)
}

export class ErrorHandlerRegistry {
  private handlers: Map<symbol, ErrorHandler> = new Map()

  subscribe(handler: ErrorHandler): () => void {
    const key = Symbol('handler')
    this.handlers.set(key, handler)
    return () => {
      this.handlers.delete(key)
    }
  }

  notify(error: unknown): void {
    for (const handler of this.handlers.values()) {
      dispatchToHandler(handler, error)
    }
  }

  clear(): void {
    this.handlers.clear()
  }
}
