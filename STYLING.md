# Frontend Styling Guide

This document explains how styling works in the Public-Frontend, what theme tokens and utilities are available, and how to use them consistently across the app.

- Tech: Tailwind (base), plain CSS variables and utility classes
- Entry CSS: `src/index.css`
- Import point: `src/main.jsx` imports `index.css`

The project uses a global dark theme with a gradient background, brand color accents, and a small set of reusable CSS utility classes. These classes are lightweight and compatible even without Tailwind-specific at-rules.

---

## Quick Start

- Global CSS is already imported in `src/main.jsx` via `import './index.css'`.
- Wrap pages with:

```jsx
<div className="min-h-screen text-foreground">
  {/* page content */}
</div>
```

- Prefer the provided utility classes (card, input, btn, table) for consistent visuals.

---

## Theme Tokens (CSS Variables)
Defined in `src/index.css` under `:root`.

- `--color-brand-300`: Indigo-300 (link/accents)
- `--color-brand-400`: Indigo-400
- `--color-brand-500`: Indigo-500
- `--color-brand-600`: Indigo-600 (primary button)
- `--color-brand-700`: Indigo-700
- `--color-foreground`: Base text color (light gray)
- `--color-muted`: Muted/secondary text (slate-400)
- `--color-border`: Border color (slate-700)
- `--color-surface`: Surface color (slate-900)
- `--color-bg-1`: Background gradient stop 1 (black)
- `--color-bg-2`: Background gradient stop 2 (slate-950)
- `--color-bg-3`: Background gradient stop 3 (slate-900)

Global background is a gradient from `--color-bg-1` → `--color-bg-2` → `--color-bg-3`.

---

## Reusable Utility Classes
All defined in `src/index.css`.

- Containers
  - `card`: Rounded panel with border+shadow and surface bg.
- Inputs
  - `input`: Full-width input/select with border, surface bg, and focus ring.
  - `label`: Small muted label.
- Buttons
  - `btn`: Base button (rounded, medium weight).
  - `btn-primary`: Indigo primary.
  - `btn-secondary`: Bordered neutral.
- Segmented control
  - `segmented`: Inline container with border and surface bg.
  - `segmented > .active`: Active segment (indigo bg, white text).
- Table
  - `table-head`: Header row style.
  - `table-row`: Body rows with border and hover bg.
- Links
  - `badge-link`: Subtle brand link with underline on hover.

### Bridge Utilities
- Text
  - `text-foreground`, `text-muted`, `text-foreground-80`
- Background
  - `bg-surface`, `bg-surface-95` (95% opaque surface for overlays)
- Border
  - `border-border`
- Brand helpers
  - `bg-brand-600`, `border-brand-500`, `text-brand-300`, `bg-brand-600-20`

---

## Usage Patterns (Examples)

### Buttons
```jsx
<button className="btn btn-primary">Save</button>
<button className="btn btn-secondary">Cancel</button>
```

### Inputs + Labels
```jsx
<label className="label">Email</label>
<input className="input" placeholder="name@example.com" />
```

### Card
```jsx
<div className="card p-4">
  <h3 className="font-semibold">Panel Title</h3>
  <p className="text-muted">Description text</p>
</div>
```

### Segmented Control
```jsx
<div className="segmented">
  <button className="active">General</button>
  <button>Advanced</button>
</div>
```

### Table
```jsx
<table className="w-full text-sm">
  <thead>
    <tr className="table-head">
      <th className="py-2 pr-4">Name</th>
      <th className="py-2 pr-4">Email</th>
    </tr>
  </thead>
  <tbody>
    <tr className="table-row">
      <td className="py-2 pr-4">Jane</td>
      <td className="py-2 pr-4">jane@example.com</td>
    </tr>
  </tbody>
</table>
```

### Modal / Overlay Panel
```jsx
<div className="fixed inset-0 z-50 flex items-center justify-center">
  <div className="absolute inset-0 bg-black/60" />
  <div className="relative z-10 card p-4 max-w-3xl w-full">
    {/* content */}
  </div>
</div>
```

### Hover Preview Container
```jsx
<div className="fixed z-50 p-2 rounded-lg border border-border bg-surface-95 shadow-xl">
  {/* image / pdf iframe / video */}
</div>
```

### Shimmer / Skeleton
```jsx
<div className="w-full h-10 rounded-md bg-surface animate-pulse" />
```

---

## Customization

- Edit `:root` variables in `src/index.css` to change the theme globally:
  - Primary brand: `--color-brand-600` (and related shades)
  - Text: `--color-foreground`, `--color-muted`
  - Borders: `--color-border`
  - Surface: `--color-surface`
  - Background gradient: `--color-bg-1/2/3`

- You can mix Tailwind utilities with these classes. The theme classes are plain CSS so they work regardless of Tailwind plugins.

---

## Files and Entry Points
- Theme and utilities: `src/index.css`
- Global import: `src/main.jsx`
- Example usage:
  - Recruiter dashboard: `src/components/Public/other/SearchProfiles.jsx`
  - Site wrappers: `src/pages/HomePage.jsx`, `src/pages/About.jsx`

---

## Notes
- We intentionally avoid Tailwind-only at-rules like `@apply` or `@theme` inside `index.css` so editors and builds without full Tailwind processing still behave predictably.
- Navbar and Footer currently use a few direct gradient/utility classes; they can be fully tokenized later (optional cleanup) to match the rest of the site.
- Accessibility: buttons and inputs include visible focus rings; ensure that custom elements also provide a focus style.

If you want me to switch the brand accent (e.g., from Indigo to Sky/Teal), share a hex or Tailwind color and I’ll update the tokens once for the whole app.
