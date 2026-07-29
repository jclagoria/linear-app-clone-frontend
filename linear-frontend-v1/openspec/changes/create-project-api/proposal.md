# Create Project API

## Problem Statement

The frontend currently supports listing projects via `GET /api/v1/projects` but lacks the ability to create new projects. Users cannot create projects through the UI because there is no API client function, no form component, and the store's `addProject()` is only populated via WebSocket events.

## Motivation

Enables users to create new projects from the frontend UI. This is a core CRUD operation needed for project management — users must be able to create projects, not just view existing ones. The Projects page is read-only today; this change makes it writable.

## Scope

- **In scope**:
  - Add `createProject()` function to `src/shared/api/projects.ts`
  - Function accepts: `teamId` (UUID, required), `name` (string 1-255, required), `description` (string, optional), `startDate` (ISO date, optional), `targetDate` (ISO date, optional)
  - Returns the created Project object
  - Error handling for 400 (validation), 401 (unauthorized), 403 (forbidden), 422 (business rule)
  - Update `useProjectsStore.addProject()` to call the API optimistically or on success
  - Add `ProjectForm` UI component with validated form fields
  - Add success/error toast notifications
- **Out of scope**:
  - Backend API implementation (handled separately)
  - Project update/delete endpoints
  - Project creation via WebSocket events (server-side push)

## Impact

- **Files affected:** `src/shared/api/projects.ts`, `src/features/realtime/lib/project-store.ts`, new `ProjectForm` component, form schema definitions
- **Consumers:** Projects page, any feature creating projects
- **Dependencies:** `apiClient.post()` from `@/shared/lib/api-client`, React Hook Form + Zod for form validation, existing Toast component for notifications
