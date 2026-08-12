---
name: Kinetic Hospitality
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#464554'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#777586'
  outline-variant: '#c7c4d7'
  surface-tint: '#5148d7'
  primary: '#2a14b4'
  on-primary: '#ffffff'
  primary-container: '#4338ca'
  on-primary-container: '#c1beff'
  inverse-primary: '#c3c0ff'
  secondary: '#4648d4'
  on-secondary: '#ffffff'
  secondary-container: '#6063ee'
  on-secondary-container: '#fffbff'
  tertiary: '#692400'
  on-tertiary: '#ffffff'
  tertiary-container: '#8f3400'
  on-tertiary-container: '#ffb393'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e3dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#100069'
  on-primary-fixed-variant: '#372abf'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb597'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 12px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 16px
  margin: 24px
---

## Brand & Style

This design system is built for the high-stakes environment of hospitality management. The brand personality is **precise, efficient, and unflappable**. It aims to evoke an emotional response of total control and clarity amidst the chaos of daily operations.

The aesthetic follows a **Functional Minimalist** approach. It prioritizes information density and utility over decorative elements. By utilizing a "data-first" philosophy, the UI disappears to let the content lead, using generous whitespace only where necessary to separate distinct functional modules. The result is a professional, tool-like interface that feels like a high-performance instrument.

## Colors

The palette is strictly monochrome to minimize cognitive load, punctuated by a singular **Indigo** primary accent. This accent is reserved exclusively for primary actions, active states, and critical paths.

- **Primary (Indigo):** Used for CTA buttons, active navigation markers, and primary selection states.
- **Neutrals:** A range of Slate grays (`#0F172A` to `#F8FAFC`) defines the hierarchy. Text is primarily Slate-900, while borders use a consistent Slate-200.
- **Functional Colors:** Success (Emerald), Warning (Amber), and Error (Rose) are used sparingly in small-scale icons or badges to indicate system status without disrupting the minimalist aesthetic.

## Typography

The design system utilizes **Inter** exclusively to take advantage of its exceptional legibility in high-density data environments. 

The typographic scale is characterized by **tight leading** (line-height) to allow for more rows of data to be visible on-screen simultaneously. Letter spacing is slightly tightened on larger headings to maintain a "locked-in" professional look, while smaller labels utilize increased tracking and uppercase styling to ensure quick scannability during fast-paced workflows.

## Layout & Spacing

This design system employs a **4px base grid** to support high-density layouts. The layout philosophy is a **Fluid Grid with strict max-widths** for content containers.

- **Desktop:** 12-column grid with 16px gutters. Sidebars are fixed at 240px to maximize the flexible workspace for tables and dashboards.
- **Tablet:** 8-column grid with 16px gutters. Sidebars collapse into an icon-only rail.
- **Mobile:** 4-column grid with 12px gutters. 

Emphasis is placed on vertical density; padding within list items and table rows should be kept to the minimum required for touch targets (`8px` to `10px` vertical padding) to maximize information per screen.

## Elevation & Depth

To maintain a crisp, professional appearance, the design system avoids traditional heavy shadows. Instead, it uses **Tonal Layers and Low-Contrast Outlines**.

- **Level 0 (Base):** Background (`#FFFFFF`).
- **Level 1 (Cards/Sidebar):** Surface (`#F8FAFC`) with a 1px border (`#E2E8F0`).
- **Level 2 (Modals/Popovers):** White background with a very fine, highly diffused shadow: `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`.

Depth is primarily communicated through subtle shifts in background gray and the use of 1px dividers, keeping the UI flat and focused.

## Shapes

The shape language is defined by "Round Four" logic: a consistent **4px radius** (`0.25rem`) across all standard UI components.

- **Standard Elements:** Buttons, Input fields, and Chips use the 4px radius.
- **Large Elements:** Cards and Modals use an 8px radius (`rounded-lg`) to soften the larger surface areas without appearing "bubbly."
- **Small Elements:** Checkboxes and small badges maintain a 2px or 4px radius to ensure they feel sharp and precise.

This subtle rounding provides a modern touch while maintaining the architectural, grid-based rigor of the layout.

## Components

### Buttons
Primary buttons use the Indigo accent with white text. Secondary buttons use a Slate-200 border with Slate-900 text. Hover states should involve a subtle darkening of the background color (e.g., Indigo-600 to Indigo-700).

### Input Fields
Inputs are defined by 1px Slate-200 borders and a 4px radius. Focus states must use a 2px Indigo ring. Use "Body-MD" for input text to maximize space in dense forms.

### Data Tables
The core component of the system. Tables should feature:
- 1px Slate-100 horizontal dividers (no vertical lines).
- Sticky headers with a Slate-50 background.
- Row hover states using Slate-50 to aid eye-tracking.

### Chips & Badges
Small-scale, 4px rounded containers. Status badges use low-saturation background tints (e.g., light green background with dark green text) to remain secondary to the Indigo primary actions.

### Cards
Cards are flat with a 1px Slate-200 border. Avoid shadows on cards unless they are interactive or draggable. Group related data using internal 1px dividers rather than nested cards.