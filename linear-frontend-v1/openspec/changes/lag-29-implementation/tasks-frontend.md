# Tasks — Keyboard Module (Frontend)

## Scaffold

- [ ] Create FSD directory structure: `src/features/keyboard/model/`, `src/features/keyboard/ui/`, `src/shared/ui/`, `src/shared/lib/`
- [ ] Install dependencies: `zustand`, `react-hook-form`, `zod`, `vitest`, `@testing-library/react`, `msw`, `playwright`
- [ ] Configure Vitest with `@testing-library/react` and jsdom environment
- [ ] Add ESLint FSD boundary rules for `features/keyboard` → `entities/issue`, `shared/ui`, `shared/lib`
- [ ] Create shared UI components: `Modal.tsx`, `Kbd.tsx`, `Toast.tsx`, `Button.tsx`

## Components

- [ ] Create `KeyboardProvider.tsx` in `src/app/providers/` — wraps app, attaches keydown listener, provides keyboard context
- [ ] Create `useKeyboardStore.ts` in `src/features/keyboard/model/` — Zustand store with shortcuts, context, selectedIssueId, customizations, pendingSequence
- [ ] Create `shortcuts.ts` in `src/features/keyboard/model/` — define all 14 shortcuts with id, category, keys, action, contexts
- [ ] Create `keySequenceMatcher.ts` in `src/features/keyboard/model/` — handle multi-key sequences (G+I, G+P, G+C) with timeout
- [ ] Create `ShortcutHelpModal.tsx` in `src/features/keyboard/ui/` — displays shortcuts by category, filterable, focus trap
- [ ] Create `ShortcutSettingsRow.tsx` in `src/features/keyboard/ui/` — displays/edits single shortcut, conflict detection
- [ ] Create `DeleteConfirmModal.tsx` in `src/features/keyboard/ui/` — confirmation dialog for destructive deletion
- [ ] Create `ToastContainer.tsx` in `src/features/keyboard/ui/` — displays success/error/info toasts with auto-dismiss
- [ ] Create `KeyboardShortcutWrapper.tsx` in `src/features/keyboard/ui/` — HOC that enables shortcuts for wrapped content
- [ ] Create `Kbd.tsx` in `src/shared/ui/` — displays keyboard key label with aria-label
- [ ] Create `Modal.tsx` in `src/shared/ui/` — reusable modal shell with focus trap and Escape handling
- [ ] Create `Toast.tsx` in `src/shared/ui/` — individual toast notification with auto-dismiss

## State & Data

- [ ] Implement `handleKeyDown` in `useKeyboardStore` — input field detection, sequence handling, context-specificity resolution
- [ ] Implement `setContext` action — updates active shortcuts based on route
- [ ] Implement `setSelectedIssue` action — activates/deactivates issue-specific shortcuts
- [ ] Implement `updateCustomization` action — validates and saves shortcut customizations
- [ ] Implement `resetCustomizations` action — reverts to default key combinations
- [ ] Implement localStorage persistence for customizations — load on init, save on change
- [ ] Create validation schema in `src/features/keyboard/model/validation.ts` — Zod schema for shortcut key validation
- [ ] Implement `isBrowserShortcut` helper — blocks Ctrl+S, Ctrl+W, etc.
- [ ] Implement `isConflict` helper — checks if key combination is already in use

## Routing

- [ ] Create `KeyboardSettingsPage.tsx` in `src/pages/` — page for shortcut customization
- [ ] Add route `/settings/keyboard` to router configuration
- [ ] Wire `KeyboardProvider` into `App.tsx` — wraps Router
- [ ] Add context detection in `KeyboardProvider` — listens to route changes, sets context accordingly

## Integration

- [ ] Create API client for `/api/shortcuts` — GET, PUT, POST (reset)
- [ ] Integrate SSE connection for real-time issue updates — `issue.updated`, `issue.deleted`, `issue.status_changed`
- [ ] Wire shortcut actions to API calls — optimistic updates with rollback on failure
- [ ] Replace mock data with real API responses in `ShortcutHelpModal` and `ShortcutSettingsRow`
- [ ] Add toast notifications for shortcut execution feedback — success, error, info states

## Validation

### Unit Tests

- [ ] Test `keySequenceMatcher` — handles single keys, multi-key sequences, timeout, cancellation
- [ ] Test `useKeyboardStore` — setContext, setSelectedIssue, updateCustomization, resetCustomizations
- [ ] Test `isBrowserShortcut` — blocks Ctrl+S, Ctrl+W, allows custom shortcuts
- [ ] Test `isConflict` — detects conflicts with existing shortcuts
- [ ] Test `shortcutKeySchema` — validates key combinations, rejects conflicts and browser shortcuts

### Integration Tests

- [ ] Test `KeyboardProvider` — registers shortcuts, disables in input fields, handles sequences
- [ ] Test `ShortcutHelpModal` — opens with ?, filters by category, closes with Escape
- [ ] Test `ShortcutSettingsRow` — edits shortcut, detects conflicts, saves to localStorage
- [ ] Test `DeleteConfirmModal` — confirms deletion, cancels, focus return
- [ ] Test `ToastContainer` — displays toasts, auto-dismisses, manual dismiss

### E2E Tests

- [ ] Test keyboard navigation — J/K navigate list, Enter opens detail, Esc closes modal
- [ ] Test context switching — shortcuts change based on route and selection
- [ ] Test customization — edit shortcut, verify conflict detection, save and reload
- [ ] Test help modal — open with ?, filter categories, close with Escape

## Review

- [ ] Self-review: verify all 14 shortcuts are registered and functional
- [ ] Self-review: verify context-specificity resolution (detail > list > global)
- [ ] Self-review: verify focus management (trap in modal, return on close)
- [ ] Self-review: verify ARIA attributes on all interactive elements
- [ ] PR checklist: unit tests pass, integration tests pass, E2E tests pass
- [ ] PR checklist: no FSD boundary violations, no console errors, accessibility audit
