const SEQUENCE_TIMEOUT_MS = 1000

interface SequenceState {
  currentSequence: string[]
  timeoutId: ReturnType<typeof setTimeout> | null
}

const state: SequenceState = {
  currentSequence: [],
  timeoutId: null,
}

export function resetSequence(): void {
  if (state.timeoutId) {
    clearTimeout(state.timeoutId)
    state.timeoutId = null
  }
  state.currentSequence = []
}

export function handleKeyInSequence(
  key: string,
  sequences: { keys: string[]; action: string }[],
): { matched: boolean; action: string | null } {
  if (state.timeoutId) {
    clearTimeout(state.timeoutId)
    state.timeoutId = null
  }

  state.currentSequence.push(key.toLowerCase())

  const matchedSequence = sequences.find((seq) => {
    const seqKeys = seq.keys.map((k) => k.toLowerCase())
    if (seqKeys.length !== state.currentSequence.length) return false
    return seqKeys.every((k, i) => k === state.currentSequence[i])
  })

  if (matchedSequence) {
    resetSequence()
    return { matched: true, action: matchedSequence.action }
  }

  const isPartialMatch = sequences.some((seq) => {
    const seqKeys = seq.keys.map((k) => k.toLowerCase())
    if (seqKeys.length <= state.currentSequence.length) return false
    return state.currentSequence.every((k, i) => k === seqKeys[i])
  })

  if (!isPartialMatch) {
    resetSequence()
    return { matched: false, action: null }
  }

  state.timeoutId = setTimeout(() => {
    resetSequence()
  }, SEQUENCE_TIMEOUT_MS)

  return { matched: false, action: null }
}

export function isInSequence(): boolean {
  return state.currentSequence.length > 0
}

export function getCurrentSequence(): string[] {
  return [...state.currentSequence]
}
