# UI Generic Components — Frontend Design

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Component Location | `src/shared/ui/` | Follows existing FSD convention — all shared primitives live here |
| Styling | Tailwind CSS + CVA | `class-variance-authority` already in dependencies for variant management |
| Icon Library | lucide-react | Already in dependencies, tree-shakeable SVG icons |
| Component API | Forwarded refs + native HTML attributes | All components extend native element props via `ComponentHTMLAttributes` + `forwardRef` |
| State Co-location | Component-local `useState` + external `useToast` store | Primitives are presentational; Toast stack managed by Zustand store |
| Testing | Vitest + @testing-library/react | Already configured in project |
| Composition Pattern | Compound components (Card, Modal) | Header/body/footer as sub-components for layout flexibility |

## Component Tree

```
src/shared/ui/
  Button.tsx          — variant, loading, icon, disabled
  TextInput.tsx       — existing, enhanced with error state
  Select.tsx          — NEW: custom combobox with dropdown
  Checkbox.tsx        — NEW: with indeterminate state
  Textarea.tsx        — NEW: with char counter
  Modal.tsx           — NEW: portal-based, focus trap, stack
  ModalStack.tsx      — NEW: manages z-index stacking
  Card.tsx            — NEW: clickable variant
  ToastContainer.tsx  — existing, enhanced
  Toast.tsx           — NEW: individual toast with variants
  EmptyState.tsx      — NEW: illustration, title, action
  Spinner.tsx         — existing, enhanced with size variants
  LoadingOverlay.tsx  — NEW: full-page loading wrapper
```

| Component | Responsibility | Props | States |
|-----------|---------------|-------|--------|
| Button | Trigger actions | variant, loading, icon, disabled, type, onClick | default, hover, active, focused, disabled, loading |
| TextInput | Single-line text entry | value, onChange, placeholder, disabled, error, type | default, focused, filled, disabled, error |
| Select | Option picker | value, onChange, options, placeholder, disabled, error | default, open, selected, disabled, error |
| Checkbox | Boolean toggle | checked, onChange, indeterminate, disabled, label | unchecked, checked, indeterminate, disabled |
| Textarea | Multi-line text | value, onChange, maxLength, rows, disabled, error | default, focused, filled, disabled, error |
| Modal | Overlay dialog | isOpen, onClose, title, children, closeOnBackdropClick | closed, open, stacked |
| Card | Content container | title, children, onClick | default, hover (clickable) |
| Toast | Transient notification | message, type, duration, onDismiss | entering, visible, exiting |
| EmptyState | Zero-data placeholder | icon, title, description, actionLabel, onAction | single (visible) |
| Spinner | Loading indicator | size (sm/md/lg), label, className | visible, animated |
| LoadingOverlay | Full-page loader | label | visible |

## Routing

This change does not introduce new routes. Components are consumed within existing page routes (`/dashboard`, `/issues`, `/projects`, etc.) via parent feature modules.

| Route | Component | Auth | Notes |
|-------|-----------|------|-------|
| All existing routes | Consume primitives | Protected (AuthGuard) | Components rendered inside feature-specific layouts |

## State Management

- **Global state** (Zustand): `useToastStore` — manages toast queue, position, auto-dismiss timers. Separate store in `src/shared/stores/toastStore.ts`
- **Modal stack**: Zustand store (`useModalStore`) tracks open modals, z-index ordering, body scroll lock count
- **Local state** (useState): Form field values, checkbox toggles, select open/close, Textarea content — all component-local
- **Server state**: Not applicable — primitives are presentational, data is passed via props

### Store Interface — Toast

```typescript
interface ToastState {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  clearAll: () => void
}
```

### Store Interface — Modal

```typescript
interface ModalState {
  stack: { id: string; zIndex: number }[]
  push: (id: string) => void
  pop: (id: string) => void
  topId: string | null
}
```

## Data Fetching

- **Client**: Native `fetch` with auth interceptor (existing pattern in `src/shared/lib/api.ts`)
- **Components are presentational**: No data fetching inside UI primitives. Data flows via props from parent feature modules
- **Error handling**: Errors passed as `error` prop to Input/Select/Textarea; Toast notifications triggered by feature modules on API error
- **Optimistic updates**: Not needed at this layer — handled by feature modules consuming these primitives

## Asset Map

| Asset | Path | Notes |
|-------|------|-------|
| Icons | lucide-react | Import on demand, tree-shaken |
| Empty state illustration | `src/shared/assets/empty-state.svg` | Simple SVG illustration |
| Loading spinner | `Spinner.tsx` | CSS-animated SVG circle |
| Button spinner | `Spinner` inline | Reuses Spinner component with sm size |

## Validation Strategy

| Field | Rule | Error Message |
|-------|------|---------------|
| Input (required) | Non-empty when required prop set | "This field is required" |
| Select (required) | Option selected when required prop set | "Please select an option" |
| Textarea (required) | Non-empty when required prop set | "This field is required" |
| Textarea (maxLength) | Length ≤ maxLength | "Maximum {n} characters" |

Validation display (label, error, hint) is delegated to the Form Module. The UI primitive accepts and renders an `error` string prop but does not own validation logic.

## Accessibility

- **Keyboard navigation**: All interactive elements keyboard-reachable via Tab. Modal traps focus (Tab/Shift+Tab cycle within). Escape closes Modal, Select dropdown, and Toast (if focused)
- **ARIA**:
  - Button: Native `<button>` with aria-busy when loading
  - Select: `role="combobox"` + `aria-expanded` + `aria-controls` + `aria-activedescendant`
  - Checkbox: Native `<input type="checkbox">` with `aria-checked="mixed"` for indeterminate
  - Modal: `role="dialog"` + `aria-modal="true"` + `aria-labelledby` on title
  - Toast: `role="status"` + `aria-live="polite"` — announces on appearance
  - EmptyState: `role="region"` + `aria-label` describing empty context
  - LoadingIndicator: `role="status"` + `aria-busy="true"` + `aria-label="Loading"`
- **Screen reader**: All form inputs paired with `<label>` via `htmlFor`/`id`. Error messages linked via `aria-describedby`. Focus returned to trigger element on Modal/Toast dismiss
- **Focus management**: Modal locks scroll on body, traps focus, returns to trigger on close. Focus ring visible on all interactive elements (2px offset ring via Tailwind `focus-visible`)
