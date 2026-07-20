# Tasks — UI Generic Components (Frontend)

## Scaffold

- [ ] Verify project structure: `src/shared/ui/` directory exists with barrel export (`index.ts`)
- [ ] Verify `class-variance-authority` and `lucide-react` are in `package.json` dependencies
- [ ] Create `src/shared/stores/` directory for Zustand stores (toast, modal)

## Components

- [ ] **Button** (`src/shared/ui/Button.tsx`): forwardRef, variant (primary/secondary/danger), loading state with inline Spinner, disabled, native button props via extended `ButtonHTMLAttributes`, CVA for variant styles
- [ ] **TextInput** (`src/shared/ui/TextInput.tsx`): enhance existing component — forwardRef, error state with red border + error message below, type variants (text/email/password), native input props, CVA for state styles
- [ ] **Select** (`src/shared/ui/Select.tsx`): forwardRef, custom combobox with dropdown list, value/onChange/options/placeholder/disabled/error props, aria-expanded/aria-activedescendant, keyboard navigation (Enter to open, Arrow keys to navigate, Escape to close)
- [ ] **Checkbox** (`src/shared/ui/Checkbox.tsx`): forwardRef, checked/onChange/indeterminate/disabled/label props, native `<input type="checkbox">` with `aria-checked="mixed"` for indeterminate, CVA for state styles
- [ ] **Textarea** (`src/shared/ui/Textarea.tsx`): forwardRef, value/onChange/maxLength/rows/disabled/error props, character counter (current/max) when maxLength set, native textarea element
- [ ] **Modal** + **ModalStack** (`src/shared/ui/Modal.tsx`, `src/shared/ui/ModalStack.tsx`): portal-based overlay, isOpen/onClose/title/children/closeOnBackdropClick, focus trap (Tab/Shift+Tab cycle), Escape to close, body scroll lock, z-index stacking via Zustand store, `role="dialog"` + `aria-modal="true"`
- [ ] **Card** (`src/shared/ui/Card.tsx`): title/children/onClick props, default state, hover/pressed when clickable (role="button" + keyboard support), CVA for clickable variant
- [ ] **Toast** + **ToastContainer** (`src/shared/ui/Toast.tsx`, `src/shared/ui/ToastContainer.tsx`): Toast with message/type(success/error/info)/duration/onDismiss, entering/visible/exiting states, `role="status"` + `aria-live="polite"`. ToastContainer renders from Zustand store queue, fixed-positioned, manages stack positioning and auto-dismiss timers
- [ ] **EmptyState** (`src/shared/ui/EmptyState.tsx`): icon/title/description/actionLabel/onAction props, SVG illustration, optional action button, `role="region"` with `aria-label`
- [ ] **Spinner** (`src/shared/ui/Spinner.tsx`): enhance existing — size variants (sm/md/lg), optional label, CSS-animated SVG circle, `role="status"` + `aria-busy="true"`
- [ ] **LoadingOverlay** (`src/shared/ui/LoadingOverlay.tsx`): full-page wrapper, centered Spinner + label, `role="status"` + `aria-live="polite"`, optional `aria-label`

## State & Data

- [ ] **Toast store** (`src/shared/stores/toastStore.ts`): Zustand store — toast queue (`Toast[]`), addToast (returns id), removeToast (by id), clearAll. Auto-dismiss timer management. Exported typed hook `useToastStore`
- [ ] **Modal store** (`src/shared/stores/modalStore.ts`): Zustand store — stack `{ id, zIndex }[]`, push, pop, topId getter. Exported typed hook `useModalStore`

## Routing

- [ ] No new routes needed — components consumed within existing pages (`/dashboard`, `/issues`, `/projects`, etc.)

## Integration

- [ ] Ensure all components exported from `src/shared/ui/index.ts` barrel file
- [ ] Verify components render correctly inside existing feature modules (quick smoke test in one feature page)

## Validation

- [ ] **Unit tests** (`src/shared/ui/**/*.test.tsx`): Vitest + @testing-library/react
  - Button: renders variants, loading state shows spinner, disabled prevents click, forwardRef works
  - TextInput: renders with placeholder, value updates, error state shows message, disabled blocks input
  - Select: opens dropdown on click, selects option, calls onChange, shows placeholder
  - Checkbox: toggles checked state, indeterminate renders dash, disabled prevents toggle
  - Textarea: multi-line input, character counter display at maxLength
  - Modal: opens/closes, Escape closes, backdrop click closes when enabled, focus trap cycles Tab
  - Card: renders title/content, clickable card invokes onClick, hover state applied
  - Toast: renders message, dismisses on close button, auto-dismiss after duration
  - EmptyState: renders icon/title/description, action button calls onAction
  - Spinner: renders at all sizes, label displayed
  - LoadingOverlay: full-page covers viewport, centered spinner
  - ToastStore: add/remove/clear toasts, auto-dismiss mock
  - ModalStore: push/pop stack, z-index ordering, topId
- [ ] **Accessibility tests**: keyboard navigation for all interactive components, ARIA attributes present (role, aria-*), focus management in Modal (trap + return)

## Review

- [ ] Self-review: verify all components follow FSD conventions in `src/shared/ui/`
- [ ] PR checklist: components use forwardRef + extend native HTML attributes, CVA for variants, Zustand for cross-cutting state, all states covered (default/loading/error/disabled/empty), tests pass
