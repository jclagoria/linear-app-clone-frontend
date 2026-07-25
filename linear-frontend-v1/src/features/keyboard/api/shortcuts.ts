import { apiClient } from '@/shared/lib/api-client'

export interface ShortcutCustomization {
  [shortcutId: string]: string
}

export async function fetchShortcuts(): Promise<ShortcutCustomization> {
  const data = await apiClient.get<ShortcutCustomization>('/shortcuts')
  return data
}

export async function updateShortcuts(
  customizations: ShortcutCustomization,
): Promise<ShortcutCustomization> {
  const data = await apiClient.put<ShortcutCustomization>('/shortcuts', customizations)
  return data
}

export async function resetShortcuts(): Promise<ShortcutCustomization> {
  const data = await apiClient.post<ShortcutCustomization>('/shortcuts/reset')
  return data
}
