import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { IssuesPage } from '@/pages/IssuesPage'
import { IssueBoardPage } from '@/pages/IssueBoardPage'
import { IssueDetailPage } from '@/pages/IssueDetailPage'
import { CreateIssuePage } from '@/pages/CreateIssuePage'
import { EditIssuePage } from '@/pages/EditIssuePage'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { ProjectDetailPage } from '@/pages/ProjectDetailPage'
import { ProjectSettingsPage } from '@/pages/ProjectSettingsPage'
import { CyclesPage } from '@/pages/CyclesPage'
import { NotificationPanelPage } from '@/pages/NotificationPanelPage'
import { CommentThreadPage } from '@/pages/CommentThreadPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { KeyboardSettingsPage } from '@/pages/KeyboardSettingsPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { AuthGuard } from '@/features/auth/ui/AuthGuard'
import { AppLayout } from '@/app/AppLayout'
import { WebSocketProvider } from '@/app/providers/WebSocketProvider'
import { OptimisticProvider } from '@/app/providers/OptimisticProvider'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    element: <AuthGuard />,
    children: [
      {
        element: (
          <WebSocketProvider>
            <OptimisticProvider>
              <AppLayout />
            </OptimisticProvider>
          </WebSocketProvider>
        ),
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'dashboard', element: <Navigate to="/" replace /> },
          { path: 'issues', element: <IssuesPage /> },
          { path: 'issues/board', element: <IssueBoardPage /> },
          { path: 'issues/create', element: <CreateIssuePage /> },
          { path: 'issues/:id', element: <IssueDetailPage /> },
          { path: 'issues/:id/edit', element: <EditIssuePage /> },
          { path: 'issues/:id/comments', element: <CommentThreadPage /> },
          { path: 'projects', element: <ProjectsPage /> },
          { path: 'projects/:id', element: <ProjectDetailPage /> },
          { path: 'projects/:id/settings', element: <ProjectSettingsPage /> },
          { path: 'cycles', element: <CyclesPage /> },
          { path: 'notifications', element: <NotificationPanelPage /> },
          { path: 'settings', element: <SettingsPage /> },
          { path: 'settings/keyboard', element: <KeyboardSettingsPage /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
