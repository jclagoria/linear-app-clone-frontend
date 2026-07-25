import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { IssuesPage } from '@/pages/IssuesPage'
import { IssueDetailPage } from '@/pages/IssueDetailPage'
import { CreateIssuePage } from '@/pages/CreateIssuePage'
import { EditIssuePage } from '@/pages/EditIssuePage'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { ProjectDetailPage } from '@/pages/ProjectDetailPage'
import { ProjectSettingsPage } from '@/pages/ProjectSettingsPage'
import { CyclesPage } from '@/pages/CyclesPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { KeyboardSettingsPage } from '@/pages/KeyboardSettingsPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { AuthGuard } from '@/features/auth/ui/AuthGuard'
import { AppLayout } from '@/app/AppLayout'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'dashboard', element: <Navigate to="/" replace /> },
          { path: 'issues', element: <IssuesPage /> },
          { path: 'issues/create', element: <CreateIssuePage /> },
          { path: 'issues/:id', element: <IssueDetailPage /> },
          { path: 'issues/:id/edit', element: <EditIssuePage /> },
          { path: 'projects', element: <ProjectsPage /> },
          { path: 'projects/:id', element: <ProjectDetailPage /> },
          { path: 'projects/:id/settings', element: <ProjectSettingsPage /> },
          { path: 'cycles', element: <CyclesPage /> },
          { path: 'settings', element: <SettingsPage /> },
          { path: 'settings/keyboard', element: <KeyboardSettingsPage /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
