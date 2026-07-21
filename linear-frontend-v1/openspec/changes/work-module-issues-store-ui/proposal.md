# Work Module: Issues Store & UI Components

## Problem Statement

The application currently lacks a dedicated Work Module to manage issues — the core work item of the system. Without an Issues Store, issue-related UI components, and CRUD operations, users cannot create, view, filter, or manage their work items. This blocks all downstream issue-centric functionality (dashboards, boards, real-time updates).

## Motivation

Issues are the primary unit of work in a Linear-like project management tool. Delivering the Work Module unblocks the entire issue management workflow: users can browse, create, filter, and update issues. This is the foundational feature that enables project boards, cycle tracking, and team collaboration on work items.

## Scope

- **In scope**:
  - Issues Store (Zustand) with state shape: `issues[]`, `selectedIssueId`, `filters`, `isLoading`, `pagination`
  - Issues CRUD operations via API module (fetch, create, update, delete)
  - Auto-generated issue identifiers (ENG-123 format)
  - Default status "Todo" and priority "No Priority" on creation
  - IssueCard component for compact display
  - IssueList component with filtering
  - IssueDetail component with comments and labels display
  - IssueFilters component for status, assignee, project, cycle, labels
  - IssueForm component for create/edit with validation
  - Selectors: `selectIssuesByStatus`

- **Out of scope**:
  - Real-time issue updates (separate Realtime Module ticket)
  - Keyboard shortcuts for issue operations (separate Keyboard Module)
  - Backend API implementation
  - Drag-and-drop board view
  - Roadmap/gantt views
  - Bulk issue operations
  - Issue import/export

## Impact

- **Affected modules**: Work Module (new), State Module (new store), UI Module (new components)
- **New directories**: `src/features/work/stores/`, `src/features/work/components/`, `src/features/work/types/`, `src/features/work/api/`
- **Store additions**: IssuesStore in State Module with issues, filters, pagination, loading state
- **Depends on**: State Module (Ticket 03) for store patterns, API Module (Ticket 04) for HTTP client, UI Module (Ticket 05) for shared primitives
- **Consumers**: Dashboard (issue count widgets), Project Detail (issue list), Cycle Detail (issue list), Search (issue results)
