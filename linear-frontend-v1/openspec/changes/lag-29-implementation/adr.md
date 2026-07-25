# ADR Review Manifest

- Status: completed
- Review date: 2026-07-25

## Review Summary

ADR review completed for the Keyboard Module (LAG-29). Three significant architectural decisions were identified from the frontend design and recorded as individual MADR-full ADRs.

## In-Force ADRs Reviewed

- None - `<repo>/adr/` has no in-force ADRs.

## New Durable ADRs Created

- **ADR-001: Context-Specificity for Keyboard Shortcut Conflict Resolution** — Uses a three-tier hierarchy (detail > list > global) to resolve shortcut conflicts, ensuring more specific contexts always win.
- **ADR-002: Zustand + localStorage for Offline-First Shortcut Customizations** — Stores user customizations in Zustand with localStorage persistence, accepting manual sync trade-offs for offline access.
- **ADR-003: Server-Sent Events over WebSocket for Real-Time Updates** — Uses SSE for one-way server-to-client updates, avoiding WebSocket complexity when bidirectional communication is unnecessary.

---

# ADR-001: Context-Specificity for Keyboard Shortcut Conflict Resolution

---
status: "accepted"
date: 2026-07-25
decision-makers: [Frontend Team]
consulted: [Tech Research Digest, Design-Frontend Artifact]
informed: [LAG-29 Implementation Team]
---

## Context and Problem Statement

The keyboard module defines 14 shortcuts across three contexts: global, list, and detail. Some shortcuts share the same key (e.g., `Enter` could mean "open issue" in list context or "confirm edit" in detail context). The system needs a deterministic, predictable way to resolve which shortcut fires when the same key exists in multiple contexts.

## Decision Drivers

- Predictability: Users must know which action will fire before pressing a key
- Specificity: More specific contexts (detail) should override less specific ones (global)
- Simplicity: The resolution logic must be easy to understand and debug
- Extensibility: New contexts can be added without breaking existing resolution

## Considered Options

- Context-specificity hierarchy (detail > list > global)
- Most-recently-registered shortcut wins
- Explicit priority numbers on each shortcut
- User-configured priority overrides

## Decision Outcome

Chosen option: "Context-specificity hierarchy (detail > list > global)", because it maps naturally to user mental models — when viewing an issue detail, the user expects issue-specific shortcuts to take precedence over navigation shortcuts.

### Consequences

- Good, because resolution is deterministic and context-aware
- Good, because new contexts can be added with a clear specificity level
- Bad, because global shortcuts are unavailable in detail context even if not conflicting
- Bad, because users cannot override the hierarchy per-shortcut

### Confirmation

Verified by testing that `Enter` in list context triggers "open issue" while `Enter` in detail context triggers "confirm edit" — same key, different actions based on context.

## Pros and Cons of the Options

### Context-specificity hierarchy (detail > list > global)

- Good, because mirrors user expectations (specific context = specific shortcuts)
- Good, because no configuration needed — hierarchy is implicit
- Neutral, because requires defining context levels at design time
- Bad, because global shortcuts are suppressed in specific contexts

### Most-recently-registered shortcut wins

- Good, because dynamic — last registered shortcut takes precedence
- Bad, because order-dependent — registration order affects behavior
- Bad, because unpredictable if shortcuts register/deregister dynamically

### Explicit priority numbers on each shortcut

- Good, because fully configurable — any shortcut can outrank any other
- Bad, because requires manual priority management
- Bad, because priority conflicts are possible if two shortcuts share a number

### User-configured priority overrides

- Good, because ultimate flexibility
- Bad, because UX complexity — users must understand the priority system
- Bad, because most users will never need to change defaults

## More Information

- Related: `design-frontend.md` § Keyboard Context Mapping
- Related: `specs/frontend/keyboard-module/spec.md` REQ-003 (Conflict Resolution)
- Follow-up: Consider adding a user preference to allow global shortcuts in detail context if demand arises
