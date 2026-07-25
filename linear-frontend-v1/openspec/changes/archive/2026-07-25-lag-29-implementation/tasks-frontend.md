# Tasks — Keyboard Module (Frontend)

## Scaffold

- [x] Create FSD directory structure: `src/features/keyboard/model/`, `src/features/keyboard/ui/`, `src/shared/ui/`, `src/shared/lib/`
- [x] Install dependencies: `zustand`, `react-hook-form`, `zod`, `vitest`, `@testing-library/react`, `msw`, `playwright`
- [x] Configure Vitest with `@testing-library/react` and jsdom environment
- [x] Add ESLint FSD boundary rules for `features/keyboard` → `entities/issue`, `shared/ui`, `shared/lib`
- [x] Create shared UI components: `Modal.tsx`, `Kbd.tsx`, `Toast.tsx`, `Button.tsx`

## Components

- [x] Create `KeyboardProvider.tsx` in `src/app/providers/` — wraps app, attaches keydown listener, provides keyboard context
- [x] Create `useKeyboardStore.ts` in `src/features/keyboard/model/` — Zustand store with shortcuts, context, selectedIssueId, customizations, pendingSequence
- [x] Create `shortcuts.ts` in `src/features/keyboard/model/` — define all 14 shortcuts with id, category, keys, action, contexts
- [x] Create `keySequenceMatcher.ts` in `src/features/keyboard/model/` — handle multi-key sequences (G+I, G+P, G+C) with timeout
- [x] Create `ShortcutHelpModal.tsx` in `src/features/keyboard/ui/` — displays shortcuts by category, filterable, focus trap
- [x] Create `ShortcutSettingsRow.tsx` in `src/features/keyboard/ui/` — displays/edits single shortcut, conflict detection
- [x] Create `DeleteConfirmModal.tsx` in `src/features/keyboard/ui/` — confirmation dialog for destructive deletion
- [x] Create `ToastContainer.tsx` in `src/features/keyboard/ui/` — displays success/error/info toasts with auto-dismiss
- [x] Create `KeyboardShortcutWrapper.tsx` in `src/features/keyboard/ui/` — HOC that enables shortcuts for wrapped content
- [x] Create `Kbd.tsx` in `src/shared/ui/` — displays keyboard key label with aria-label
- [x] Create `Modal.tsx` in `src/shared/ui/` — reusable modal shell with focus trap and Escape handling
- [x] Create `Toast.tsx` in `src/shared/ui/` — individual toast notification with auto-dismiss

## State & Data

- [x] Implement `handleKeyDown` in `useKeyboardStore` — input field detection, sequence handling, context-specificity resolution
- [x] Implement `setContext` action — updates active shortcuts based on route
- [x] Implement `setSelectedIssue` action — activates/deactivates issue-specific shortcuts
- [x] Implement `updateCustomization` action — validates and saves shortcut customizations
- [x] Implement `resetCustomizations` action — reverts to default key combinations
- [x] Implement localStorage persistence for customizations — load on init, save on change
- [x] Create validation schema in `src/features/keyboard/model/validation.ts` — Zod schema for shortcut key validation
- [x] Implement `isBrowserShortcut` helper — blocks Ctrl+S, Ctrl+W, etc.
- [x] Implement `isConflict` helper — checks if key combination is already in use

## Routing

- [x] Create `KeyboardSettingsPage.tsx` in `src/pages/` — page for shortcut customization
- [x] Add route `/settings/keyboard` to router configuration
- [x] Wire `KeyboardProvider` into `App.tsx` — wraps Router
- [x] Add context detection in `KeyboardProvider` — listens to route changes, sets context accordingly

## Integration

- [x] Create API client for `/api/shortcuts` — GET, PUT, POST (reset)
- [x] Integrate SSE connection for real-time issue updates — `issue.updated`, `issue.deleted`, `issue.status_changed`
- [x] Wire shortcut actions to API calls — optimistic updates with rollback on failure
- [x] Replace mock data with real API responses in `ShortcutHelpModal` and `ShortcutSettingsRow`
- [x] Add toast notifications for shortcut execution feedback — success, error, info states

## Validation

### Unit Tests

- [x] Test `keySequenceMatcher` — handles single keys, multi-key sequences, timeout, cancellation
- [x] Test `useKeyboardStore` — setContext, setSelectedIssue, updateCustomization, resetCustomizations
- [x] Test `isBrowserShortcut` — blocks Ctrl+S, Ctrl+W, allows custom shortcuts
- [x] Test `isConflict` — detects conflicts with existing shortcuts
- [x] Test `shortcutKeySchema` — validates key combinations, rejects conflicts and browser shortcuts

### Integration Tests

- [x] Test `KeyboardProvider` — registers shortcuts, disables in input fields, handles sequences
- [x] Test `ShortcutHelpModal` — opens with ?, filters by category, closes with Escape
- [x] Test `ShortcutSettingsRow` — edits shortcut, detects conflicts, saves to localStorage
- [x] Test `DeleteConfirmModal` — confirms deletion, cancels, focus return
- [x] Test `ToastContainer` — displays toasts, auto-dismisses, manual dismiss

### E2E Tests

- [x] Test keyboard navigation — J/K navigate list, Enter opens detail, Esc closes modal
- [x] Test context switching — shortcuts change based on route and selection
- [x] Test customization — edit shortcut, verify conflict detection, save and reload
- [x] Test help modal — open with ?, filter categories, close with Escape

## Review

- [x] Self-review: verify all 14 shortcuts are registered and functional
- [x] Self-review: verify context-specificity resolution (detail > list > global)
- [x] Self-review: verify focus management (trap in modal, return on close)
- [x] Self-review: verify ARIA attributes on all interactive elements
- [x] PR checklist: unit tests pass, integration tests pass, E2E tests pass
- [x] PR checklist: no FSD boundary violations, no console errors, accessibility audit
