import type { Label } from '../types'

export function selectLabelById(labels: Label[], id: string | null): Label | undefined {
  return labels.find((l) => l.id === id)
}

export function selectLabelsByIds(labels: Label[], ids: string[]): Label[] {
  return labels.filter((l) => ids.includes(l.id))
}
