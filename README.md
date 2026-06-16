# DigitalCraft Studio — Responsive Frontend Interface

A complete, responsive landing page for a fictional digital service agency,
**DigitalCraft Studio**. Built for "Project 1: Responsive Frontend Interface"
using only HTML5, CSS3, and vanilla JavaScript — no frameworks, no build
tools, no backend.

## Folder structure

```
digitalcraft-responsive-interface/
│
├── index.html      Semantic markup for every section
├── style.css       Mobile-first styles, CSS variables, Grid & Flexbox
├── script.js       Vanilla JS for nav, validation, and the project filter
└── README.md       This file
```

## How to run it

No installation or server needed. Just open `index.html` directly in any
modern browser (double-click it, or right-click → Open With → your browser).

## What's included

**Header / navigation** — sticky header with a logo, a five-link nav, and a
"Start a Project" button. Below 1024px the nav collapses into a hamburger
menu (animated icon, `aria-expanded`, closes on link click / outside click /
Escape). Above 1024px it expands into a horizontal bar. The active section
is highlighted in the nav as you scroll, using `IntersectionObserver`.

**Hero** — headline, supporting copy, two calls to action, and a small
CSS-only illustration of three overlapping device frames (desktop, tablet,
mobile) that visually echoes the "responsive" theme without using a single
image file.

**Services** — three cards (Responsive Web Design, Frontend Development,
UI/UX Strategy) in a CSS Grid that goes from one column on mobile to three
on desktop.

**Process** — a five-step `<ol>` (Discover → Wireframe → Build → Test →
Improve) since it's a genuine sequence. Stacked vertically with a
connecting line on mobile, two columns on tablet, and a full horizontal
timeline on desktop.

**Projects** — three sample project cards, each tagged with the
technologies used (HTML / CSS / JavaScript / Responsive). A filter bar
above the grid lets you show only the cards that match a tag — this is the
"extra interactive feature" required by the brief.

**Contact** — a name / email / message form with custom JavaScript
validation (no fields left empty, email must contain `@` and a `.`).
Errors show as text next to each field (never color alone), and a success
message appears once the form passes validation. The form does **not**
send data anywhere, as specified.

**Footer** — brand name and tagline, quick links, text-only social links,
and a copyright line with a JavaScript-updated year.

## Design decisions worth knowing about

- **Color palette**: warm mocha/beige and soft blue accents on an
  off-white background, with all body text and interactive text set in
  darker, accessible shades of those same hues (`--color-mocha-dark`,
  `--color-blue-dark`) so contrast stays readable — the lighter tones are
  reserved for decorative fills like badges and the hero illustration.
- **Typography**: a serif display face (system-available, e.g. Georgia)
  for headings paired with the system UI sans-serif for body text — two
  families total, no web fonts to download.
- **Breakpoints**: `768px` (tablet) and `1024px` (desktop), applied
  per-component rather than all at once — for example, the hero switches
  to a side-by-side layout at 768px, while the navigation only switches
  from a hamburger to a full horizontal bar at 1024px, since five links
  plus a logo need the extra room.
- **No external images**: every visual (device illustration, project
  thumbnails, icon badges) is built from CSS gradients and shapes, which
  keeps the page light and avoids layout shift while loading.

## Testing checklist

- [ ] **Mobile (< 768px)**: single-column layout, hamburger menu opens and
      closes, no horizontal scrolling anywhere.
- [ ] **Tablet (768px–1023px)**: hero goes side-by-side, cards move to a
      2-column grid, process steps appear in two columns.
- [ ] **Desktop (≥ 1024px)**: full horizontal nav appears (hamburger
      disappears), 3-column card grids, full horizontal process timeline.
- [ ] **Navigation**: every link smooth-scrolls to the correct section; the
      matching nav link highlights as you scroll; the mobile menu closes
      after selecting a link.
- [ ] **Form validation**: submitting empty fields shows an error per
      field; an email without `@`/`.` is rejected; a fully valid submission
      shows the success message and clears the form.
- [ ] **Project filter**: clicking each tag button (All / HTML / CSS /
      JavaScript / Responsive) shows only the matching project cards.
- [ ] **Accessibility**: Tab through the whole page — every interactive
      element gets a visible focus ring, the skip link appears on first
      Tab press, and the hamburger button's `aria-expanded` value flips
      correctly when toggled.
- [ ] **Visual quality**: consistent spacing, shadows, and corner radius
      across all cards and buttons; no layout breaking at any width
      between 320px and 1920px.
