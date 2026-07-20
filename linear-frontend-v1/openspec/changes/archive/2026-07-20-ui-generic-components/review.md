# Review — UI Generic Components

## Spec Compliance

All requirements from the frontend spec are addressed in the design and tasks:

- **Button variants** (primary/secondary/danger): Covered in design (CVA variants) and tasks. Loading spinner via inline Spinner component.
- **Input with error state**: Existing TextInput enhanced per design — error prop, red border, error message display. Tasks include forwardRef and native attribute extension.
- **Select dropdown**: Design specifies custom combobox with full keyboard nav (aria-expanded, aria-activedescendant, Enter/Arrow/Escape). Tasks cover implementation.
- **Checkbox with indeterminate**: Native `<input type="checkbox">` with `aria-checked="mixed"`. Covered.
- **Textarea with char counter**: maxLength prop + character counter display. Covered.
- **Modal with stack management**: Portal-based, focus trap, Escape close, backdrop click, body scroll lock, z-index stacking via Zustand ModalStore. Fully covered.
- **Card**: Clickable variant with hover/pressed states, `role="button"` when clickable. Covered.
- **Toast notifications**: Toast component with entering/visible/exiting states + ToastContainer managing queue from Zustand store, auto-dismiss, manual dismiss. Covered.
- **EmptyState**: Icon, title, description, optional action button. Covered.
- **LoadingIndicator**: Spinner with size variants + LoadingOverlay for full-page. Covered.
- **Accessibility**: Every component has ARIA roles, keyboard support, and focus management documented in design and spec. Tasks include dedicated a11y tests.

## Edge Cases

- **Modal stack overflow**: Multiple nested modals (3+) — z-index may approach arbitrary high values. ModalStore should cap or recycle z-indices.
- **Toast queue overflow**: Rapid toast triggers may overflow viewport. Consider max visible toasts (e.g., 5) with queue-based FIFO when exceeded.
- **Textarea paste overflow**: Pasting text exceeding maxLength should truncate at maxLength, not block the paste entirely.
- **Select dropdown positioning**: Dropdown may clip outside viewport. Consider flip/flip-fallback behavior or portal rendering.
- **Spinner inside Button**: Label text should remain visible and not collapse when spinner shows.
- **EmptyState action vs no action**: When no action provided, component should not render an interactive element. Currently handled.

## Leakage Check

No implementation details leaked into specs. Specs describe behaviour (GIVEN/WHEN/THEN), component interfaces (props, states, events), and accessibility requirements. Design details (CVA, Zustand stores, portal rendering, forwardRef pattern) are correctly confined to the design artifact.

## Checklist

- [x] All requirements covered
- [x] Scenarios pass (spec scenarios mapped to design/tasks)
- [x] Error states handled (error prop on Input, Select, Textarea; disabled on all interactive)
- [x] No technical detail in specs
