import type { ResponseInterceptor } from '../ApiClient'
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
} from '../errors'

export const errorInterceptor: ResponseInterceptor = async (response, _url) => {
  if (response.ok) return response

  let body: Record<string, unknown> = {}
  try {
    body = (await response.json()) as Record<string, unknown>
  } catch {
    // Response body is not JSON — use default messages
  }

  const errorBody = (body?.error as Record<string, unknown> | undefined) ?? body
  const code = (errorBody?.code as string) ?? ''
  const message = (errorBody?.message as string) ?? response.statusText
  const details = errorBody?.details as
    | Array<{ field: string; message: string }>
    | undefined

  switch (response.status) {
    case 400:
      throw new ValidationError(message, details)
    case 401:
      throw new UnauthorizedError(message)
    case 403:
      throw new ForbiddenError(message)
    case 404:
      throw new NotFoundError(message)
    case 409:
      throw new ConflictError(message)
    case 422:
      throw new BusinessRuleError(message)
    case 429: {
      const retryAfter = parseRetryAfter(response)
      throw new RateLimitError(message, retryAfter)
    }
    default: {
      if (response.status >= 500) {
        throw new InternalError(message)
      }
      throw new ApiError(code, message, response.status, details)
    }
  }
}

function parseRetryAfter(response: Response): number {
  const header = response.headers.get('Retry-After')
  if (!header) return 5
  const seconds = Number(header)
  return Number.isFinite(seconds) ? seconds : 5
}
