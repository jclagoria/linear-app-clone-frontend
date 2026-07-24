import { useState, useCallback, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/widgets/Sidebar/ui/Sidebar'
import { MobileSidebarOverlay } from '@/widgets/Sidebar/ui/MobileSidebarOverlay'
import { Header } from '@/widgets/Header/ui/Header'
import { useUIStore } from '@/shared/stores/uiStore'
import { useWebSocketStore } from '@/shared/stores/websocketStore'
import { ConnectionErrorModal } from '@/features/realtime/ui/ConnectionErrorModal'
import { ReconnectionToast } from '@/features/realtime/ui/ReconnectionToast'
import { RevertToast } from '@/features/realtime/ui/RevertToast'
import { useWebSocket } from '@/app/providers/WebSocketProvider'

export function AppLayout() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const connectionStatus = useWebSocketStore((s) => s.connectionStatus)
  const reconnectAttempts = useWebSocketStore((s) => s.reconnectAttempts)
  const { reconnect } = useWebSocket()

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const hamburgerRef = useRef<HTMLButtonElement | null>(null)

  const handleHamburgerClick = useCallback(() => {
    setIsMobileSidebarOpen((prev) => !prev)
  }, [])

  const handleMobileSidebarClose = useCallback(() => {
    setIsMobileSidebarOpen(false)
    requestAnimationFrame(() => {
      hamburgerRef.current?.focus()
    })
  }, [])

  const setHamburgerRef = useCallback((el: HTMLButtonElement | null) => {
    hamburgerRef.current = el
  }, [])

  const showReconnectionToast = connectionStatus === 'reconnecting'
  const showErrorModal = connectionStatus === 'disconnected' && reconnectAttempts >= 10

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      {/* Desktop sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      {/* Mobile sidebar overlay */}
      <MobileSidebarOverlay
        isOpen={isMobileSidebarOpen}
        onClose={handleMobileSidebarClose}
      />

      <div className="flex flex-1 flex-col min-w-0">
        <Header
          connectionStatus={connectionStatus}
          onReconnect={reconnect}
          showHamburger={true}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onHamburgerClick={handleHamburgerClick}
          hamburgerRef={setHamburgerRef}
        />

        <main className="flex-1 overflow-y-auto p-6" role="main">
          <Outlet />
        </main>
      </div>

      {/* Realtime overlays */}
      {showReconnectionToast && (
        <ReconnectionToast
          onRetry={reconnect}
          message="Connection lost. Reconnecting..."
        />
      )}

      <ConnectionErrorModal
        isVisible={showErrorModal}
        onReconnect={reconnect}
        onLogout={() => {
          window.location.href = '/login'
        }}
      />

      <RevertToast />
    </div>
  )
}
