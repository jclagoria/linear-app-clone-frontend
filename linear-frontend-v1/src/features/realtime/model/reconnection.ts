export interface ReconnectionConfig {
  initialDelayMs: number
  maxDelayMs: number
  maxAttempts: number
  multiplier: number
}

const DEFAULT_CONFIG: ReconnectionConfig = {
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  maxAttempts: 10,
  multiplier: 2,
}

export function calculateBackoff(
  attempt: number,
  config: ReconnectionConfig = DEFAULT_CONFIG,
): number {
  const delay = config.initialDelayMs * Math.pow(config.multiplier, attempt)
  return Math.min(delay, config.maxDelayMs)
}

export function shouldReconnect(attempt: number, maxAttempts = DEFAULT_CONFIG.maxAttempts): boolean {
  return attempt < maxAttempts
}
