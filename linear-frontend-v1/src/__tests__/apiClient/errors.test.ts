import { describe, it, expect } from 'vitest'
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
import {
  isValidationError,
  isUnauthorizedError,
  isForbiddenError,
  isNotFoundError,
  isConflictError,
  isBusinessRuleError,
  isRateLimitError,
  isInternalError,
  isApiError,
} from '@/shared/lib/api-client/errors/typeGuards'

describe('ApiError class hierarchy', () => {
  describe('ApiError (base)', () => {
    it('creates with code, message, and status', () => {
      const error = new ApiError('TEST_ERROR', 'Test message', 499)
      expect(error.code).toBe('TEST_ERROR')
      expect(error.message).toBe('Test message')
      expect(error.status).toBe(499)
      expect(error.details).toBeUndefined()
      expect(error.name).toBe('ApiError')
    })

    it('creates with details', () => {
      const details = [{ field: 'title', message: 'Required' }]
      const error = new ApiError('TEST', 'msg', 400, details)
      expect(error.details).toEqual(details)
    })

    it('serializes to JSON', () => {
      const error = new ApiError('CODE', 'message', 400)
      expect(error.toJSON()).toEqual({
        name: 'ApiError',
        code: 'CODE',
        message: 'message',
        status: 400,
        details: undefined,
      })
    })
  })

  describe('ValidationError (400)', () => {
    it('creates with default details', () => {
      const error = new ValidationError('Invalid input')
      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.status).toBe(400)
      expect(error.details).toEqual([])
      expect(error.name).toBe('ValidationError')
    })

    it('creates with field-level details', () => {
      const details = [{ field: 'email', message: 'Invalid email' }]
      const error = new ValidationError('Invalid input', details)
      expect(error.details).toEqual(details)
    })

    it('is instanceof ApiError', () => {
      expect(new ValidationError('msg')).toBeInstanceOf(ApiError)
    })
  })

  describe('UnauthorizedError (401)', () => {
    it('creates with defaults', () => {
      const error = new UnauthorizedError()
      expect(error.code).toBe('UNAUTHORIZED')
      expect(error.status).toBe(401)
      expect(error.message).toBe('Invalid or expired token')
      expect(error.name).toBe('UnauthorizedError')
    })

    it('is instanceof ApiError', () => {
      expect(new UnauthorizedError()).toBeInstanceOf(ApiError)
    })
  })

  describe('ForbiddenError (403)', () => {
    it('creates with defaults', () => {
      const error = new ForbiddenError()
      expect(error.code).toBe('FORBIDDEN')
      expect(error.status).toBe(403)
      expect(error.name).toBe('ForbiddenError')
    })
  })

  describe('NotFoundError (404)', () => {
    it('creates with defaults', () => {
      const error = new NotFoundError()
      expect(error.code).toBe('NOT_FOUND')
      expect(error.status).toBe(404)
      expect(error.name).toBe('NotFoundError')
    })
  })

  describe('ConflictError (409)', () => {
    it('creates with defaults', () => {
      const error = new ConflictError()
      expect(error.code).toBe('CONFLICT')
      expect(error.status).toBe(409)
      expect(error.name).toBe('ConflictError')
    })
  })

  describe('BusinessRuleError (422)', () => {
    it('creates with defaults', () => {
      const error = new BusinessRuleError()
      expect(error.code).toBe('BUSINESS_RULE_ERROR')
      expect(error.status).toBe(422)
      expect(error.name).toBe('BusinessRuleError')
    })
  })

  describe('RateLimitError (429)', () => {
    it('creates with retryAfter', () => {
      const error = new RateLimitError('Too many requests', 30)
      expect(error.code).toBe('RATE_LIMITED')
      expect(error.status).toBe(429)
      expect(error.retryAfter).toBe(30)
      expect(error.name).toBe('RateLimitError')
    })

    it('is instanceof ApiError', () => {
      expect(new RateLimitError('msg', 5)).toBeInstanceOf(ApiError)
    })
  })

  describe('InternalError (500+)', () => {
    it('creates with defaults', () => {
      const error = new InternalError()
      expect(error.code).toBe('SERVER_ERROR')
      expect(error.status).toBe(500)
      expect(error.name).toBe('InternalError')
    })
  })
})

describe('Type guard utilities', () => {
  const validation = new ValidationError('bad')
  const unauthorized = new UnauthorizedError()
  const forbidden = new ForbiddenError()
  const notFound = new NotFoundError()
  const conflict = new ConflictError()
  const business = new BusinessRuleError()
  const rateLimit = new RateLimitError('msg', 5)
  const internal = new InternalError()
  const base = new ApiError('BASE', 'base', 0)

  it('isApiError matches all error types', () => {
    expect(isApiError(validation)).toBe(true)
    expect(isApiError(unauthorized)).toBe(true)
    expect(isApiError(base)).toBe(true)
    expect(isApiError(null)).toBe(false)
    expect(isApiError(new Error())).toBe(false)
  })

  it('isValidationError matches only ValidationError', () => {
    expect(isValidationError(validation)).toBe(true)
    expect(isValidationError(unauthorized)).toBe(false)
    expect(isValidationError(forbidden)).toBe(false)
  })

  it('isUnauthorizedError matches only UnauthorizedError', () => {
    expect(isUnauthorizedError(unauthorized)).toBe(true)
    expect(isUnauthorizedError(notFound)).toBe(false)
  })

  it('isForbiddenError matches only ForbiddenError', () => {
    expect(isForbiddenError(forbidden)).toBe(true)
    expect(isForbiddenError(internal)).toBe(false)
  })

  it('isNotFoundError matches only NotFoundError', () => {
    expect(isNotFoundError(notFound)).toBe(true)
    expect(isNotFoundError(conflict)).toBe(false)
  })

  it('isConflictError matches only ConflictError', () => {
    expect(isConflictError(conflict)).toBe(true)
    expect(isConflictError(business)).toBe(false)
  })

  it('isBusinessRuleError matches only BusinessRuleError', () => {
    expect(isBusinessRuleError(business)).toBe(true)
    expect(isBusinessRuleError(rateLimit)).toBe(false)
  })

  it('isRateLimitError matches only RateLimitError', () => {
    expect(isRateLimitError(rateLimit)).toBe(true)
    expect(isRateLimitError(internal)).toBe(false)
  })

  it('isInternalError matches only InternalError', () => {
    expect(isInternalError(internal)).toBe(true)
    expect(isInternalError(base)).toBe(false)
  })
})
