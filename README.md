# SUGIRA Muryango — web application

Oversight and case management for the SUGIRA Muryango home-visiting programme
(FXB Rwanda, in partnership with the University of Rwanda and Boston College).

This is a **design prototype**: a static, click-through front end with representative
data. There is no backend and no real programme data in it.

## Running it

No build step. Serve the folder:

```bash
npx serve .
```

## What is in here

| File | What it holds |
| --- | --- |
| `index.html` | All ten screens, one per `<section class="screen">` |
| `style.css` | Design tokens and every component |
| `app.js` | Routing, breadcrumbs, nav state, tabs, modals, toasts |

Screens: Dashboard · Households · Household detail · Visits · Safeguarding ·
Case detail · Field status · Reports · Wall board · and a marked placeholder for
routes in the information architecture that this pass does not cover.

Deep links work — `#households`, `#case`, `#wall` and so on.

## Design system

| Token | Value | Where it came from |
| --- | --- | --- |
| Primary | `#A23A91` | The SUGIRA mobile Figma file |
| Chrome | `#36132F` | Derived — same hue, 16.3:1 on white |
| Surface | `#FFFFFF` on `#F7F8FA` | White cards, grey field |
| Radius | 12px cards, 8px controls, 100px pills | |
| Type | Inter — 14 / 16 / 18 / 22 / 42 | The SUGIRA mobile Figma file |
| Critical | `#C10007` | A child at risk |
| Warning | `#BB4D00` | Behind schedule, not reporting |

The brand colour is confined to the rail, buttons, the active tab, the avatar,
progress bars and chart bars. Card surfaces stay white.

**Why warnings are amber and criticals are red:** the primary sits at hue 310, so
red at 357 is 47 degrees away and still reads as an alarm. A nearer brand hue would
have collapsed the two.

## Icons

Hugeicons Pro, **Stroke / Rounded** throughout — 26 symbols defined once in an inline
SVG sprite at the top of `index.html` and referenced with `<use href="#i-name">`.

Each symbol carries its own `stroke="currentColor"` and per-path stroke widths (Hugeicons
uses 2px for dot accents against 1.5px elsewhere), so CSS sets `color` rather than `stroke`
on icon rules. Setting `stroke` there would override the symbol and flatten those accents.

## Accessibility notes

- The active navigation item carries a colour bar as well as a background change,
  because the background difference alone is about 1.2:1.
- The app ships **light only**: `<html data-theme="light">` pins it, so a visitor's
  dark OS setting cannot flip it. The dark palette is still in the stylesheet —
  delete that attribute to restore automatic light/dark.
- Verified at 1440px and 375px with no horizontal overflow on any screen.
