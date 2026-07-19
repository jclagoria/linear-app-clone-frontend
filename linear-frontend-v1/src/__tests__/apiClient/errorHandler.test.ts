import { describe, it, expect, vi } from 'vitest'
import { ErrorHandlerRegistry } from '@/shared/lib/api-client/ErrorHandler'
import {
  ApiError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  BusinessRuleError,
  RateLimitError,
  InternalError,
} from '@/shared/lib/api-client/errors'

describe('ErrorHandlerRegistry', () => {
  it('subscribes and notifies on validation error', () => {
    const registry = new ErrorHandlerRegistry()
    const handler = { onValidationError: vi.fn() }
    registry.subscribe(handler)

    const error = new ValidationError('Invalid input', [{ field: 'name', message: 'Required' }])
    registry.notify(error)

    expect(handler.onValidationError).toHaveBeenCalledWith(error)
  })

  it('notifies on unauthorized error', () => {
    const registry = new ErrorHandlerRegistry()
    const handler = { onUnauthorized: vi.fn() }
    registry.subscribe(handler)

    const error = new UnauthorizedError()
    registry.notify(error)

    expect(handler.onUnauthorized).toHaveBeenCalledWith(error)
  })

  it('notifies on forbidden error', () => {
    const registry = new ErrorHandlerRegistry()
    const handler = { onForbidden: vi.fn() }
    registry.subscribe(handler)

    const error = new ForbiddenError()
    registry.notify(error)

    expect(handler.onForbidden).toHaveBeenCalledWith(error)
  })

  it('notifies on not found error', () => {
    const registry = new ErrorHandlerRegistry()
    const handler = { onNotFound: vi.fn() }
    registry.subscribe(handler)

    const error = new NotFoundError()
    registry.notify(error)

    expect(handler.onNotFound).toHaveBeenCalledWith(error)
  })

  it('notifies on conflict error', () => {
    const registry = new ErrorHandlerRegistry()
    const handler = { onConflict: vi.fn() }
    registry.subscribe(handler)

    const error = new ConflictError()
    registry.notify(error)

    expect(handler.onConflict).toHaveBeenCalledWith(error)
  })

  it('notifies on business rule error', () => {
    const registry = new ErrorHandlerRegistry()
    const handler = { onBusinessRuleError: vi.fn() }
    registry.subscribe(handler)

    const error = new BusinessRuleError()
    registry.notify(error)

    expect(handler.onBusinessRuleError).toHaveBeenCalledWith(error)
  })

  it('notifies on rate limit error', () => {
    const registry = new ErrorHandlerRegistry()
    const handler = { onRateLimited: vi.fn() }
    registry.subscribe(handler)

    const error = new RateLimitError('Too many requests', 30)
    registry.notify(error)

    expect(handler.onRateLimited).toHaveBeenCalledWith(error)
  })

  it('notifies on server error', () => {
    const registry = new ErrorHandlerRegistry()
    const handler = { onServerError: vi.fn() }
    registry.subscribe(handler)

    const error = new InternalError()
    registry.notify(error)

    expect(handler.onServerError).toHaveBeenCalledWith(error)
  })

  it('calls onUnknown for unregistered error types', () => {
    const registry = new ErrorHandlerRegistry()
    const handler = { onUnknown: vi.fn() }
    registry.subscribe(handler)

    registry.notify(new Error('Generic error'))

    expect(handler.onUnknown).toHaveBeenCalled()
  })

  it('calls onUnknown for non-Error types', () => {
    const registry = new ErrorHandlerRegistry()
    const handler = { onUnknown: vi.fn() }
    registry.subscribe(handler)

    registry.notify('string error')

    expect(handler.onUnknown).toHaveBeenCalledWith('string error')
  })

  it('supports multiple subscribers', () => {
    const registry = new ErrorHandlerRegistry()
    const handler1 = { onNotFound: vi.fn() }
    const handler2 = { onNotFound: vi.fn() }

    registry.subscribe(handler1)
    registry.subscribe(handler2)

    const error = new NotFoundError()
    registry.notify(error)

    expect(handler1.onNotFound).toHaveBeenCalledWith(error)
    expect(handler2.onNotFound).toHaveBeenCalledWith(error)
  })

  it('unsubscribe stops notifications', () => {
    const registry = new ErrorHandlerRegistry()
    const handler = { onNotFound: vi.fn() }

    const unsubscribe = registry.subscribe(handler)
    unsubscribe()

    registry.notify(new NotFoundError())

    expect(handler.onNotFound).not.toHaveBeenCalled()
  })

  it('clear removes all subscribers', () => {
    const registry = new ErrorHandlerRegistry()
    const handler = { onNotFound: vi.fn() }

    registry.subscribe(handler)
    registry.clear()

    registry.notify(new NotFoundError())

    expect(handler.onNotFound).not.toHaveBeenCalled()
  })

  it('only calls matching callback', () => {
    const registry = new ErrorHandlerRegistry()
    const handler = {
      onNotFound: vi.fn(),
      onForbidden: vi.fn(),
      onUnknown: vi.fn(),
    }

    registry.subscribe(handler)
    registry.notify(new NotFoundError())

    expect(handler.onNotFound).toHaveBeenCalled()
    expect(handler.onForbidden).not.toHaveBeenCalled()
    expect(handler.onUnknown).not.toHaveBeenCalled()
  })

  it('routes bare ApiError to onNetworkError', () => {
    const registry = new ErrorHandlerRegistry()
    const handler = { onNetworkError: vi.fn(), onUnknown: vi.fn() }

    registry.subscribe(handler)
    registry.notify(new ApiError('UNEXPECTED', 'Unexpected error', 500))

    expect(handler.onNetworkError).toHaveBeenCalled()
    expect(handler.onUnknown).not.toHaveBeenCalled()
  })
})
