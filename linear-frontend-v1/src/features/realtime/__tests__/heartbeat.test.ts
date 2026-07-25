import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createHeartbeat } from '../model/heartbeat'

describe('createHeartbeat', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('calls sendPing at configured interval', () => {
    const sendPing = vi.fn()
    const onTimeout = vi.fn()
    const heartbeat = createHeartbeat(sendPing, onTimeout, { pingIntervalMs: 1000, pongTimeoutMs: 2000 })

    heartbeat.start()

    vi.advanceTimersByTime(1000)
    expect(sendPing).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(1000)
    expect(sendPing).toHaveBeenCalledTimes(2)

    heartbeat.stop()
  })

  it('calls onTimeout if pong not received', () => {
    const sendPing = vi.fn()
    const onTimeout = vi.fn()
    const heartbeat = createHeartbeat(sendPing, onTimeout, { pingIntervalMs: 1000, pongTimeoutMs: 500 })

    heartbeat.start()

    vi.advanceTimersByTime(1000) // ping sent
    vi.advanceTimersByTime(500) // pong timeout
    expect(onTimeout).toHaveBeenCalledOnce()

    heartbeat.stop()
  })

  it('does not call onTimeout if stop is called before timeout', () => {
    const sendPing = vi.fn()
    const onTimeout = vi.fn()
    const heartbeat = createHeartbeat(sendPing, onTimeout, { pingIntervalMs: 1000, pongTimeoutMs: 500 })

    heartbeat.start()
    vi.advanceTimersByTime(1000) // ping sent
    heartbeat.stop()
    vi.advanceTimersByTime(500)
    expect(onTimeout).not.toHaveBeenCalled()
  })
})
