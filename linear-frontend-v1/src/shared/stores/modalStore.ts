import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface ModalStackItem {
  id: string
  zIndex: number
}

interface ModalState {
  stack: ModalStackItem[]
  push: (id: string) => void
  pop: (id: string) => void
  topId: string | null
}

let modalZCounter = 50

export const useModalStore = create<ModalState>()(
  devtools(
    (set, get) => ({
      stack: [],
      topId: null,

      push: (id) => {
        if (get().stack.some((item) => item.id === id)) return
        modalZCounter += 1
        const zIndex = modalZCounter
        set((state) => {
          const newStack = [...state.stack, { id, zIndex }]
          return { stack: newStack, topId: id }
        })
      },

      pop: (id) => {
        set((state) => {
          const newStack = state.stack.filter((item) => item.id !== id)
          const top = newStack.length > 0 ? newStack[newStack.length - 1] : null
          return { stack: newStack, topId: top?.id ?? null }
        })
      },
    }),
    { name: 'modal-store' },
  ),
)
