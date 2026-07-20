# UI Module — Generic Components

## Problem Statement

The Linear App Clone currently has no reusable UI component library. Buttons, inputs, modals, and other primitives must be recreated for each feature, leading to inconsistent styling, duplicated code, and slower development. The project's spec defines a UI Module with 6 categories of generic components (design system, layout, data display, forms, loading states, empty states), but none have been implemented.

## Motivation

A shared component library delivers:
- **Consistency**: Single source of truth for UI appearance and behavior
- **Velocity**: Feature teams assemble screens from primitives instead of rebuilding
- **Accessibility**: ARIA compliance baked into each component once
- **Maintenance**: Fix a button style in one place, not across 20 features

This change covers the **generic component layer only** — the primitives and composed components the UI Module spec defines. Form-specific wrappers (label, error, hint) belong to the Form Module and are out of scope.

## Scope

- **In scope**:
  - Design system primitives (Button, Input, Select, Checkbox, Textarea)
  - Composed components (Modal with stack management, Card, Toast with variants)
  - Empty state component for zero-data screens
  - Loading indicator component for action/page loading
  - Accessibility (ARIA attributes, keyboard interaction, focus management)
  - All components accept `className` for customization and support `disabled`/`error` states where applicable

- **Out of scope**:
  - Form Module field wrappers (TextField, SelectField, etc. — wraps UI primitives with label/error/hint)
  - Layout components (Sidebar, Header, MainContent — part of Layout Module)
  - Data display components (IssueList, IssueCard, etc. — part of Work Module)
  - Form components (IssueForm, LoginForm, etc. — composed by Form + UI modules)
  - Theme system implementation

## Impact

- **Consumers**: All features and modules that render UI will import from this shared component library
- **Work Module**: Will use these primitives to build IssueList, IssueCard, and related components
- **Form Module**: Will wrap UI primitives with field-level form behavior (label, error, hint)
- **Layout Module**: Will use these primitives for sidebar/header structure
- **Project structure**: New component files under `src/components/` following established conventions
