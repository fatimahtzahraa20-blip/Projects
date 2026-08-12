---
name: Hospitality Logic
colors:
  surface: '#fcf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fcf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45464d'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#fcf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
  success-emerald: '#10B981'
  warning-amber: '#F59E0B'
  error-rose: '#F43F5E'
  neutral-slate-50: '#F8FAFC'
  neutral-slate-200: '#E2E8F0'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  baseline: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  sidebar-width: 280px
---

## Brand & Style

The design system is engineered for a professional, B2B hospitality management environment where trust, clarity, and operational efficiency are paramount. The aesthetic follows a **Corporate / Modern** direction, utilizing high-density layouts and a systematic approach to state-driven UI.

The personality is authoritative and secure, designed to instill confidence in both administrators and hotel owners. It prioritizes functionality over flourish, using generous whitespace to manage complex data and subtle shadows to establish a clear information hierarchy. The interface transitions fluidly between "locked" (pending) and "active" states, using consistent semantic cues to guide the user through the verification and management lifecycle.

## Colors

The palette is anchored by **Deep Navy (#0F172A)**, providing a sophisticated and stable foundation for primary branding and navigation elements. **Slate (#64748B)** serves as the workhorse for secondary text and icons, maintaining legibility without competing with primary actions.

Semantic states are strictly enforced to communicate the lifecycle of property management:
- **Emerald (#10B981):** Signals approved status, active listings, and successful verification.
- **Amber (#F59E0B):** Used for pending approvals, "locked" features, and items requiring attention.
- **Rose (#F43F5E):** Reserved for rejected applications, suspended accounts, and critical errors.

Backgrounds primarily use a clean white or the very light **Slate 50** to separate content sections, with **Slate 200** utilized for subtle borders and dividers.

## Typography

This design system uses **Inter** exclusively to ensure a neutral, highly readable, and systematic appearance. The type scale is optimized for data-heavy dashboards.

- **Headlines:** Use tighter letter-spacing and heavier weights to establish clear section anchors.
- **Body Text:** Scaled for long-form reading in reviews and descriptions, as well as compact data entry.
- **Labels:** Status badges and table headers use uppercase styling with increased letter spacing to differentiate metadata from actionable content.
- **Mobile scaling:** Headlines are reduced in size for smaller viewports, while body text remains at 14-16px to ensure accessibility and touch-target clarity.

## Layout & Spacing

The layout is based on a **fixed sidebar-and-main-content** model for desktop, optimizing the 12-column grid for the dashboard and property management queues. 

- **Grid Strategy:** Content is organized into cards that can span 4, 6, or 12 columns depending on information density (e.g., Analytics use full-width, while property cards use 4-column spans).
- **Rhythm:** A 4px baseline grid ensures consistency across forms and tables. 
- **Breakpoints:**
  - **Desktop (1280px+):** Sidebar is fixed; content uses 32px margins.
  - **Tablet (768px - 1279px):** Sidebar collapses into a hamburger menu; content uses 24px margins.
  - **Mobile (<768px):** Single column flow with 16px margins; forms reflow from multi-column to vertical stacks.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Ambient Shadows**, avoiding heavy borders to maintain a modern SaaS feel.

- **Level 0 (Background):** Slate 50 or White.
- **Level 1 (Cards/Surface):** White background with a subtle, 1px Slate 200 border and a low-opacity, diffused shadow (0px 1px 3px rgba(15, 23, 42, 0.1)).
- **Level 2 (Modals/Dropdowns):** Higher elevation with a more pronounced shadow (0px 10px 15px rgba(15, 23, 42, 0.15)) to indicate interactivity and focus.
- **Locked State:** Property dashboards in "Pending" status use a semi-transparent Slate overlay (40% opacity) with a centered "Pending Approval" lock icon to visually communicate restricted access.

## Shapes

The design system utilizes a **Rounded (0.5rem)** logic to balance professional rigor with modern approachability.

- **Standard Elements:** Input fields, buttons, and property cards use the base 0.5rem (8px) radius.
- **Large Elements:** Modals and "Hero" dashboard cards use 1rem (16px) for a softer, more distinct container.
- **Media:** Logos are strictly circular to differentiate brand identity from rectangular property cover images (which follow the standard 0.5rem corner radius).

## Components

### Buttons
- **Primary:** Deep Navy background, white text. High contrast for main actions like "Approve" or "Save."
- **Secondary:** White background, Slate 200 border, Deep Navy text. Used for "Edit" or "Cancel."
- **Destructive:** Rose background or Rose text-link for "Reject" or "Suspend."

### Status Badges
Small, high-contrast pills using the semantic color palette. Text is `label-md` (uppercase) for maximum visibility at small sizes.

### Input Fields
Clean, 1px Slate 200 borders that transition to Deep Navy on focus. Validation states use Emerald (success) or Rose (error) for the border and helper text.

### Cards
The primary container for property listings. Includes a header area for the property name, a central body for metadata (rooms, category), and a footer for the status badge and primary action button.

### Tables & Lists
High-density rows with 8px vertical padding. Use zebra-striping (Slate 50) on hover to help users track data across wide rows in the Admin Queue.

### Modals
Centered overlays for critical admin actions (e.g., providing a rejection reason). Must include a clear header, a body with the "Reason for Action" text area, and primary/secondary button pairings in the footer.