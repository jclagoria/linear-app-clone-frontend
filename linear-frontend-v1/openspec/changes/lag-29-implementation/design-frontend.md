# Keyboard Module — Frontend Design

## Architecture Decisions

### Framework & Build

| Decision | Choice | Rationale | Trade-offs |
|----------|--------|-----------|------------|
| Framework | React 19 + Vite 8 (CSR) | Team expertise, ecosystem maturity | No SSR/SSG; CSR sufficient for this app |
| Build | Vite 8 | ESM-native, fast HMR, optimized builds | Less opinionated than Next.js |
| Package Manager | pnpm | Faster, disk-efficient | Different hoisting than npm/yarn |

**Validation against tech-research-digest.md:**
- React with Vite (CSR) is a recommended option for React apps.
- Zustand is listed as a recommended state management option.
- Tailwind CSS is listed as a recommended styling option.
- Vitest + Testing Library + MSW + Playwright is the recommended testing stack.
- ESLint + Prettier is the recommended linting setup.
- **All decisions align with the digest. No deviations.**

### State Management

| Decision | Choice | Rationale | Trade-offs |
|----------|--------|-----------|------------|
| Client state | Zustand 5 | Simple, hook-based, optimistic update friendly | No built-in devtools; lighter than Redux |
| Keyboard context | Zustand store | Keyboard state is pure client-side state | No persistence; resets on page load |
| Customizations | Zustand + localStorage | Offline access to shortcut customizations | Manual sync; potential inconsistency |

### Routing

| Decision | Choice | Rationale | Trade-offs |
|----------|--------|-----------|------------|
| Router | react-router-dom v7 | SPA routing, lazy loading | Less opinionated than TanStack Router |

### Styling

| Decision | Choice | Rationale | Trade-offs |
|----------|--------|-----------|------------|
| CSS | Tailwind CSS v4 | Utility-first, fast iteration | Larger CSS output; purge needed |

### Forms

| Decision | Choice | Rationale | Trade-offs |
|----------|--------|-----------|------------|
| Forms | react-hook-form + Zod | Type-safe validation, minimal re-renders | Learning curve for Zod schemas |

### Testing

| Decision | Choice | Rationale | Trade-offs |
|----------|--------|-----------|------------|
| Unit | Vitest + Testing Library | ESM-native, 2-3x faster, Jest-compatible API | Newer ecosystem than Jest |
| Integration | MSW | API mocking for store actions | Setup complexity |
| E2E | Playwright | Multi-browser support | Heavier than Cypress for single-browser |

### Linting

| Decision | Choice | Rationale | Trade-offs |
|----------|--------|-----------|------------|
| Lint | ESLint 9 + Prettier | Only tool with FSD boundary rules | Biome not viable for Angular |

### Real-time

| Decision | Choice | Rationale | Trade-offs |
|----------|--------|-----------|------------|
| Real-time | SSE (Server-Sent Events) | Simpler than WebSocket for one-way events | No bidirectional communication |

---

## Component Tree

```
app/
  App.tsx
    └── KeyboardProvider
          └── Router
                └── Routes
                      ├── IndexPage (redirects to /issues)
                      ├── IssuesPage
                      │     ├── IssueListWidget
                      │     │     └── IssueListItem (selectable)
                      │     └── IssueDetailWidget
                      ├── ProjectsPage
                      │     ├── ProjectListWidget
                      │     └── ProjectDetailWidget
                      ├── CyclesPage
                      │     ├── CycleListWidget
                      │     └── CycleDetailWidget
                      └── SettingsPage
                            └── KeyboardSettingsPage
                                  └── ShortcutSettings

shared/
  ui/
    Modal.tsx
    Kbd.tsx
    Toast.tsx
    Button.tsx
    Select.tsx
    Input.tsx

features/
  keyboard/
    model/
      useKeyboardStore.ts (Zustand)
      shortcuts.ts (shortcut definitions)
      keySequenceMatcher.ts (key sequence logic)
    ui/
      ShortcutHelpModal.tsx
      ShortcutSettingsRow.tsx
      DeleteConfirmModal.tsx
      ToastContainer.tsx
      KeyboardShortcutWrapper.tsx (wrapper component)

entities/
  issue/
    ui/
      IssueListItem.tsx
      IssueDetail.tsx
```

| Component | Responsibility | Props | State |
|-----------|---------------|-------|-------|
| KeyboardProvider | Wraps app, provides keyboard context, registers shortcuts | children | active, inactive (during modals) |
| useKeyboardStore | Zustand store for keyboard state | — | shortcuts, selectedIssueId, context, customizations |
| ShortcutHelpModal | Displays shortcuts by category, filterable | isOpen, onClose, shortcuts, categories | open, closed, filteredCategory |
| ShortcutSettingsRow | Displays and edits a single shortcut | shortcut, onSave, onReset | viewing, editing, conflict |
| DeleteConfirmModal | Confirms destructive deletion | isOpen, onConfirm, onCancel | open, closed |
| ToastContainer | Displays success/error/info toasts | toasts, onDismiss | active toasts array |
| KeyboardShortcutWrapper | Wrapper component that enables shortcuts for wrapped content | shortcuts, context | — |
| Kbd | Displays a keyboard key label | key | default, pressed |
| Modal | Reusable modal shell with focus trap | isOpen, onClose, title, children | open, closing |
| Toast | Individual toast notification | type, message, onDismiss, autoDismiss | visible, dismissing |
| IssueListItem | Selectable list item for issues | issue, isSelected, onSelect | default, hover, selected, focused |
| IssueDetail | Issue detail view | issue | populated |

---

## Routing

| Route | Component | Auth | Notes |
|-------|-----------|------|-------|
| `/` | IndexPage | protected | Redirects to `/issues` |
| `/issues` | IssuesPage | protected | List + detail split pane |
| `/issues/:id` | IssuesPage | protected | Detail view with issue selected |
| `/projects` | ProjectsPage | protected | List view |
| `/projects/:id` | ProjectsPage | protected | Detail view |
| `/cycles` | CyclesPage | protected | List view |
| `/cycles/:id` | CyclesPage | protected | Detail view |
| `/settings` | SettingsPage | protected | Settings hub |
| `/settings/keyboard` | KeyboardSettingsPage | protected | Keyboard shortcut customization |

### Keyboard Context Mapping

| Route Pattern | Context | Active Shortcuts |
|---------------|---------|-----------------|
| `/issues` (no selection) | list | Global + List (J, K, Enter) |
| `/issues/:id` | detail | Global + List + Issue (S, A, L, E, Delete) |
| `/projects` | list | Global + List |
| `/cycles` | list | Global + List |
| `/settings/*` | global | Global only |
| `*` (any) | global | Global only |

---

## State Management

### Keyboard Store (Zustand)

```typescript
// features/keyboard/model/useKeyboardStore.ts
interface KeyboardState {
  // Shortcut definitions
  shortcuts: Shortcut[];
  customizations: Record<string, string>; // shortcutId → custom key combo

  // Context
  context: 'global' | 'list' | 'detail';
  selectedIssueId: string | null;

  // Sequence state
  pendingSequence: string | null; // e.g., 'G'
  sequenceTimeout: NodeJS.Timeout | null;

  // Actions
  setContext: (context: KeyboardState['context']) => void;
  setSelectedIssue: (id: string | null) => void;
  registerShortcut: (shortcut: Shortcut) => void;
  unregisterShortcut: (id: string) => void;
  updateCustomization: (shortcutId: string, keyCombo: string) => void;
  resetCustomizations: () => void;
  handleKeyDown: (event: KeyboardEvent) => void;
}
```

### Shortcut Definition

```typescript
// features/keyboard/model/shortcuts.ts
interface Shortcut {
  id: string;
  category: 'global' | 'list' | 'issue';
  keys: string[];           // e.g., ['C'] or ['G', 'I']
  action: string;           // Human-readable description
  handler: () => void;
  contexts: string[];       // Route patterns where active
  conflictsWith?: string[]; // IDs of conflicting shortcuts
}
```

### State Flow

```
User presses key
  → KeyboardProvider.handleKeyDown
    → Check if in text input → skip if true
    → Check if sequence pending → handle sequence
    → Find matching shortcut for current context
      → detail context: check detail shortcuts first (highest specificity)
      → list context: check list shortcuts
      → global: check global shortcuts
    → Execute shortcut handler
    → Show toast feedback
```

### Optimistic Updates

| Action | Optimistic? | Rollback |
|--------|-------------|----------|
| Cycle status (S) | Yes | Restore previous status |
| Assign issue (A) | Yes | Restore previous assignee |
| Add label (L) | Yes | Remove added label |
| Edit title (E) | Yes | Restore previous title |
| Delete issue (Delete) | No | N/A (confirmation required) |

---

## Data Fetching

- **API client**: `fetch` with typed responses (OpenAPI 3.1 contract)
- **Error handling**: Toast notifications (success/error/info)
- **Retry**: Automatic retry on 429 (rate limit) with exponential backoff
- **Cache**: Zustand stores with manual invalidation on mutations

### API Endpoints (Keyboard Module)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/shortcuts` | GET | Fetch user's custom shortcuts |
| `/api/shortcuts` | PUT | Save custom shortcuts |
| `/api/shortcuts/reset` | POST | Reset to defaults |

### SSE Events (Real-time)

| Event | Source | Keyboard Impact |
|-------|--------|----------------|
| `issue.updated` | Backend | Update selected issue in store |
| `issue.deleted` | Backend | Clear selection if deleted issue was selected |
| `issue.status_changed` | Backend | Update status display |

---

## Asset Map

| Asset | Path | Notes |
|-------|------|-------|
| Shortcut icon (keyboard) | `shared/assets/icons/keyboard.svg` | Used in settings |
| Close icon | `shared/assets/icons/x.svg` | Modal close button |
| Check icon | `shared/assets/icons/check.svg` | Success toast |
| Warning icon | `shared/assets/icons/alert-triangle.svg` | Error toast |
| Info icon | `shared/assets/icons/info.svg` | Info toast |
| Delete icon | `shared/assets/icons/trash.svg` | Delete confirmation |
| Edit icon | `shared/assets/icons/pencil.svg` | Edit button |
| Inter font | `shared/assets/fonts/Inter-*.woff2` | Primary typeface |

---

## Validation Strategy

| Field | Rule | Error Message |
|-------|------|---------------|
| Shortcut key | Must not conflict with existing shortcut | "This key combination is already in use" |
| Shortcut key | Must not be a browser shortcut (Ctrl+S, Ctrl+W, etc.) | "This key combination is reserved by the browser" |
| Shortcut key | Must be a single printable character or modifier+character | "Invalid key combination" |
| Shortcut key | Must not be empty | "Please press a key" |
| Shortcut key | Must not be the same as current value | "New shortcut must be different from current" |

### Zod Schema

```typescript
// features/keyboard/model/validation.ts
import { z } from 'zod';

const shortcutKeySchema = z.string()
  .min(1, 'Please press a key')
  .refine(
    (key) => !isBrowserShortcut(key),
    'This key combination is reserved by the browser'
  )
  .refine(
    (key) => !isConflict(key),
    'This key combination is already in use'
  );

const shortcutCustomizationSchema = z.object({
  shortcutId: z.string(),
  keyCombo: shortcutKeySchema,
});
```

---

## Accessibility

### Keyboard Navigation

- **Tab order**: All interactive elements are focusable via Tab
- **Focus trap**: Modals trap focus within the modal (Tab cycles through modal elements)
- **Focus return**: After modal close, focus returns to the triggering element
- **Shortcuts disabled in inputs**: When focus is on `<input>`, `<textarea>`, `<select>`, or `[contenteditable]`, shortcuts do not fire

### ARIA

| Component | ARIA Attributes |
|-----------|-----------------|
| ShortcutHelpModal | `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-title"` |
| DeleteConfirmModal | `role="alertdialog"`, `aria-modal="true"`, `aria-labelledby="dialog-title"` |
| Toast | `role="status"`, `aria-live="polite"` |
| ShortcutSettingsRow | `aria-label="Edit {shortcut name}"` |
| Kbd | `aria-label="{shortcut description}: {key combination}"` |
| Tab list | `role="tablist"`, `role="tab"`, `aria-selected` |

### Screen Reader

- All shortcuts are discoverable via the help modal (? key)
- Shortcut actions are announced via `aria-live` regions
- Modal titles are linked via `aria-labelledby`
- Kbd elements have `aria-label` describing the shortcut action

### Focus Management

```
1. User presses "?" → Focus moves to ShortcutHelpModal
2. Modal opens → Focus trapped inside modal
3. User presses Esc → Modal closes → Focus returns to trigger element
4. User navigates to list → Focus moves to first list item
5. User presses J/K → Focus moves to next/prev item
6. User presses Enter → Focus moves to detail view
```

---

## Implementation Notes

### FSD Layer Assignment

| Component | FSD Layer | Path |
|-----------|-----------|------|
| KeyboardProvider | `app/` | `src/app/providers/KeyboardProvider.tsx` |
| useKeyboardStore | `features/keyboard/model/` | `src/features/keyboard/model/useKeyboardStore.ts` |
| shortcuts | `features/keyboard/model/` | `src/features/keyboard/model/shortcuts.ts` |
| keySequenceMatcher | `features/keyboard/model/` | `src/features/keyboard/model/keySequenceMatcher.ts` |
| ShortcutHelpModal | `features/keyboard/ui/` | `src/features/keyboard/ui/ShortcutHelpModal.tsx` |
| ShortcutSettingsRow | `features/keyboard/ui/` | `src/features/keyboard/ui/ShortcutSettingsRow.tsx` |
| DeleteConfirmModal | `features/keyboard/ui/` | `src/features/keyboard/ui/DeleteConfirmModal.tsx` |
| ToastContainer | `features/keyboard/ui/` | `src/features/keyboard/ui/ToastContainer.tsx` |
| KeyboardSettingsPage | `pages/` | `src/pages/KeyboardSettingsPage.tsx` |
| Modal | `shared/ui/` | `src/shared/ui/Modal.tsx` |
| Kbd | `shared/ui/` | `src/shared/ui/Kbd.tsx` |
| Toast | `shared/ui/` | `src/shared/ui/Toast.tsx` |

### Dependency Rules (FSD)

```
features/keyboard → entities/issue, shared/ui, shared/lib
pages/* → features/keyboard, widgets/*, entities/*, shared/*
shared/* → node_modules (NOT features, entities, pages)
```

### Bundle Size Considerations

- Keyboard module is a small feature; no lazy loading needed
- Modal and Toast are shared components used elsewhere
- Zustand store is <1KB gzipped
- No heavy dependencies introduced

### Performance

- Keydown listener attached once at the KeyboardProvider level
- Shortcut matching is O(1) via Map lookup
- No re-renders on key press (state updates are batched)
- Sequence timeout uses `requestIdleCallback` for cleanup
