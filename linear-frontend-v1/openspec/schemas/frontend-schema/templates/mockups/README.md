# Mockups — {Domain}

Interactive HTML/CSS/vanilla JS mockups. One `.html` file per screen, no build step.

## Conventions

- **Single file per screen**: all CSS inline in `<style>`, all JS inline in `<script>`
- **Mock data**: declared as JS arrays/objects at top of `<script>`, no external API calls
- **Navigation**: simple `<a href="file.html">` links between screens
- **Design tokens**: inline CSS custom properties matching design-system.md tokens
- **States**: toggle with JS buttons or URL params (e.g. `?state=loading`)
- **Icons**: Unicode emoji or inline SVG — no icon library dependency

## File structure

```
mockups/
├── index.html              — screen index / navigation hub
├── auth-login.html         — one per wireframe screen
├── auth-register.html
├── board-dashboard.html
├── board-kanban.html
├── board-timeline.html
├── board-calendar.html
├── board-table.html
├── card-detail.html
├── board-settings.html
├── account-settings.html
├── notification-panel.html
├── onboarding-tour.html
├── template-gallery.html
└── assets/
    └── sample-avatar.png   — shared mock assets
```

## Screen template (per file)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{ScreenName} — Mockup</title>
  <style>
    /* Design tokens — match design-system.md */
    :root {
      --color-primary: #2563EB;
      --color-surface: #F8FAFC;
      --color-surface-elevated: #FFFFFF;
      --color-border: #E2E8F0;
      --color-text-primary: #0F172A;
      --color-text-secondary: #64748B;
      --font-family: Inter, system-ui, -apple-system, sans-serif;
      --space-4: 1rem;
      --radius-md: 6px;
    }

    /* Reset */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: var(--font-family); background: var(--color-surface); color: var(--color-text-primary); }
  </style>
</head>
<body>

  <!-- App shell — shared header + content area as per wireframes -->

  <script>
    // Mock data
    const data = {
      // ... arrays matching wireframe content
    };

    // State toggles
    function setState(state) {
      document.body.dataset.state = state;
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
      render();
    });

    function render() {
      // ... render mock data into DOM
    }
  </script>
</body>
</html>
```

## State simulation

| State | How to simulate |
|-------|----------------|
| empty | Clear data array, re-render |
| loading | Show skeleton placeholders, setTimeout to populate after 1.5s |
| error | Show error banner, hide content |
| success | Show toast + next state |

## Responsive testing

Open in browser and resize. Use CSS container queries or `@media (max-width: 768px)` to test mobile layout.

## Per-screen behavior

{Map each wireframe screen to its mockup file and note special interactions:}
