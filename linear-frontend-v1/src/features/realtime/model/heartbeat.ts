export interface HeartbeatConfig {
  pingIntervalMs: number
  pongTimeoutMs: number
}

const DEFAULT_CONFIG: HeartbeatConfig = {
  pingIntervalMs: 30000,
  pongTimeoutMs: 10000,
}

export function createHeartbeat(
  sendPing: () => void,
  onTimeout: () => void,
  config: HeartbeatConfig = DEFAULT_CONFIG,
): { start: () => void; stop: () => void } {
  let pingTimer: ReturnType<typeof setInterval> | null = null
  let pongTimer: ReturnType<typeof setTimeout> | null = null

  const clearTimers = () => {
    if (pingTimer !== null) {
      clearInterval(pingTimer)
      pingTimer = null
    }
    if (pongTimer !== null) {
      clearTimeout(pongTimer)
      pongTimer = null
    }
  }

  return {
    start: () => {
      clearTimers()
      pingTimer = setInterval(() => {
        sendPing()
        pongTimer = setTimeout(() => {
          onTimeout()
          clearTimers()
        }, config.pongTimeoutMs)
      }, config.pingIntervalMs)
    },
    stop: clearTimers,
  }
}
