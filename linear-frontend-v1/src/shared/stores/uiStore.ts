import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'
export type KeyboardContext = 'global' | 'list' | 'detail'

interface UIState {
  sidebarCollapsed: boolean
  theme: Theme
  activeModal: string | null
  keyboardContext: KeyboardContext

  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setTheme: (theme: Theme) => void
  openModal: (id: string) => void
  closeModal: () => void
  setKeyboardContext: (context: KeyboardContext) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      theme: 'system',
      activeModal: null,
      keyboardContext: 'global',

      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed: boolean) => set({ sidebarCollapsed: collapsed }),
      setTheme: (theme: Theme) => set({ theme }),
      openModal: (id: string) => set({ activeModal: id }),
      closeModal: () => set({ activeModal: null }),
      setKeyboardContext: (context: KeyboardContext) => set({ keyboardContext: context }),
    }),
    {
      name: 'linear-ui-store',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    },
  ),
)
