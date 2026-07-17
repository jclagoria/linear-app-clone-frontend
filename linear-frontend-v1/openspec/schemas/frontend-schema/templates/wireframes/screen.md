# Wireframe: {ScreenName}

## Purpose & Flow Context

{One sentence: what this screen lets the user do, which flow step it serves, entry/exit points}

---

## Notation Legend

| Symbol | Meaning | Symbol | Meaning |
|--------|---------|--------|---------|
| `[...]` | Button / interactive element | `[>...▼]` | Dropdown |
| `_______` | Text input / editable field | `[X]` | Close / dismiss |
| `⚠` | Warning / due date | `📎N` | N attachments |
| `💬N` | N comments | `🔗` | Card relationship |
| `👤` | User / mention | `○ ●` | Radio unselected / selected |

## Accessibility — Shared Conventions

All interactive screens inherit these. Per-screen specifics noted where they diverge.

| Concern | Convention |
|---------|------------|
| Landmarks | `header`, `main`, `aside`, `contentinfo` |
| Heading order | One `h1` per screen, `h2` for sections |
| Accessible names | Icon-only controls get `aria-label` |
| Keyboard | Tab, Enter/Space, Escape, Arrow keys |
| Target size | ≥24×24 CSS px reservation |
| Non-color intent | Icon + text, never color alone |

---

## Layout Regions

**Grid**: 12-column / {N}-column layout. Spacing cadence: 8px / 4px rhythm intent.

**App-shell**: Shared header + nav + container. Regions:

| Region | Content | Notes |
|--------|---------|-------|
| {Region} | {elements it contains} | {behavior, visibility, sticky?} |

**Content hierarchy** (by visual priority):
1. {Primary element — first thing user needs}
2. {Secondary element}
3. {Tertiary element}

```
+------------------------------------------------------------------+
|  {Region: e.g. Header — Logo / Nav / UserMenu / NotifBadge}     |
+------------------------------------------------------------------+
|                                                                    |
|  +-----------------------------+  +-----------------------------+  |
|  |  {Region: e.g. Main Panel} |  |  {Region: e.g. Sidebar}    |  |
|  |                             |  |                             |  |
|  |  [{Element}]                |  |  [{Element}]               |  |
|  |  [{Element}]                |  |  [{Element}]               |  |
|  |                             |  |                             |  |
|  +-----------------------------+  +-----------------------------+  |
|                                                                    |
+------------------------------------------------------------------+
|  {Footer (if applicable)}                                        |
+------------------------------------------------------------------+
```

*Legend: [{Button}] [Input] [Link] [#Heading] [>Dropdown] [Avatar] [Icon]*

## Components & Affordances

| Element | DS Component | Behavior | Edge Cases |
|---------|-------------|----------|------------|
| {label} | {DS component name} | {tap/hover/validation/conditional visibility} | {truncation, overflow, sort, paginate} |

## Data Display

{Table vs list vs cards rationale. If table: columns, sort, filter, paginate, density, sticky header, row expansion. Progressive disclosure.}

## Content & Microcopy Intent

| Slot | Intent | Notes |
|------|--------|-------|
| {heading/label/button/placeholder} | {what this text communicates — user language, not data model} | {i18n room, terminology consistency} |

## States

### Populated (Default)

{Description of the view with data. This is the layout shown in the ASCII sketch above.}

### Empty

{Why it's empty + guide-to-action CTA. Distinguish first-run vs filtered-to-zero.}

```
+------------------------------------------------------------------+
|                                                                    |
|                     [Icon Illustration]                           |
|                     {Empty message}                               |
|                     {CTA button → action}                         |
|                                                                    |
+------------------------------------------------------------------+
```

### Loading

{Skeleton mirroring the populated layout. Describe what each region shows while loading.}

```
+------------------------------------------------------------------+
|  [===== skeleton bar =====]   [==== skeleton ===]               |
|  [==== skeleton bar =====]                                       |
+------------------------------------------------------------------+
```

### Error

{Plain-language cause + recovery action. Inline vs blocking. Placement.}

### Success / Confirmation

{What changed + next step. For state-changing actions.}

## Responsive

| Breakpoint | Changes |
|------------|---------|
| Desktop (>1024px) | {full layout as described} |
| Tablet (768-1024px) | {what stacks, what collapses} |
| Mobile (<768px) | {nav → hamburger, content-priority reorder, touch-target reservation} |

## Accessibility — Screen Composition

| Concern | Implementation |
|---------|----------------|
| Landmarks | {header, nav, main, complementary, contentinfo} |
| Heading order | h1 → h2 → h3 — one h1 per screen |
| Reading / Focus order | {sequence through regions, top→bottom, conditional reveal order} |
| Accessible names | {icon-only controls get aria-label} |
| Keyboard operability | {Tab order, Enter/Space, Escape, arrow keys} |
| Target size | ≥24×24 CSS px reservation on all interactive targets |
| Focus not obscured | {sticky regions don't hide focused element} |
| Non-color intent | {use text/icons + color, never color alone} |

*Defer to design-system: pixel contrast, focus-appearance, per-component target-size/keyboard.*
