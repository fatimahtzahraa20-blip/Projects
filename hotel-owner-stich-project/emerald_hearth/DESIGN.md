---
name: Emerald & Hearth
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#404944'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#707974'
  outline-variant: '#bfc9c3'
  surface-tint: '#2b6954'
  primary: '#003527'
  on-primary: '#ffffff'
  primary-container: '#064e3b'
  on-primary-container: '#80bea6'
  inverse-primary: '#95d3ba'
  secondary: '#5e5e5c'
  on-secondary: '#ffffff'
  secondary-container: '#e1dfdc'
  on-secondary-container: '#636360'
  tertiary: '#212f41'
  on-tertiary: '#ffffff'
  tertiary-container: '#374558'
  on-tertiary-container: '#a4b2c9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b0f0d6'
  primary-fixed-dim: '#95d3ba'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#0b513d'
  secondary-fixed: '#e4e2de'
  secondary-fixed-dim: '#c8c6c3'
  on-secondary-fixed: '#1b1c1a'
  on-secondary-fixed-variant: '#474744'
  tertiary-fixed: '#d5e3fc'
  tertiary-fixed-dim: '#b9c7df'
  on-tertiary-fixed: '#0d1c2e'
  on-tertiary-fixed-variant: '#3a485b'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  display-lg:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Noto Serif
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  headline-sm:
    fontFamily: Noto Serif
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  caption:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

This design system is built for high-end hospitality and boutique travel experiences. The brand personality is rooted in "Atmospheric Luxury"—a blend of traditional warmth and contemporary precision. It aims to evoke a sense of sanctuary, reliability, and bespoke service.

The design style utilizes a **Modern-Tactile** approach. It leans into high-contrast color pairings and generous whitespace, while using subtle gradients and layered shadows to provide depth. The interface should feel less like a software tool and more like a physical concierge desk: polished, substantial, and welcoming.

## Colors

The palette is anchored by **Deep Emerald**, used for primary actions, branding, and sophisticated accents. 

- **Primary (Deep Emerald):** Used for key calls-to-action and active states. It represents growth and premium quality.
- **Secondary (Cream Surface):** The background canvas. This warm off-white reduces eye strain and feels more inviting than pure white.
- **Tertiary (Warm Slate):** Used for secondary UI elements, icons, and subtle borders.
- **Neutral (Slate Dark):** Used for primary typography to ensure high legibility while maintaining the "warm" characteristic of the palette.

Functional colors (Success, Warning, Error) should be desaturated to align with the boutique aesthetic, avoiding neon-bright tones.

## Typography

This design system employs a classic serif/sans-serif pairing to communicate both heritage and modern efficiency.

- **Headlines:** Uses a refined serif to establish an editorial feel. Tracking is slightly tightened on larger display sizes to maintain a cohesive visual block.
- **Body:** Uses a contemporary grotesque sans-serif. It is chosen for its high x-height and exceptional legibility at smaller scales.
- **Labels:** Small labels and "Overlines" should use the sans-serif in a semi-bold weight with increased letter spacing and uppercase styling to denote hierarchy clearly.

## Layout & Spacing

The layout philosophy follows a **Fluid-Fixed Hybrid**. Content is housed in a centered container with a maximum width of 1280px. 

- **Grid:** A 12-column grid is used for desktop, 8-column for tablet, and 4-column for mobile.
- **Rhythm:** An 8px linear scale governs all spacing.
- **Boutique Feel:** To achieve the premium look, use generous vertical padding (`64px` to `120px`) between major sections to allow the imagery and typography to "breathe." Avoid dense clusters of information; favor clarity and focus.

## Elevation & Depth

Depth in this design system is created through **Soft-Layered Shadows** rather than harsh borders. 

1.  **Level 0 (Base):** The Cream Surface (#fdfbf7).
2.  **Level 1 (Cards/Floating Elements):** Subtle, multi-layered shadows. Use a combination of a sharp 2px blur with 5% opacity and a wider 12px blur with 8% opacity, both tinted with the Warm Slate color to avoid "dirty" grey shadows.
3.  **Level 2 (Modals/Popovers):** Higher displacement (Y-axis) to suggest significant distance from the base, paired with a backdrop blur (glassmorphism) of 4px to maintain context of the underlying page.

## Shapes

The shape language is defined by "Round Twelve" logic, providing a soft, approachable, and organic feel that contrasts with the traditional serif typography.

- **Small Components:** Inputs and buttons use a `0.5rem` (8px) radius.
- **Large Components:** Cards, image containers, and modals use a `1rem` (16px) or `1.5rem` (24px) radius depending on their scale.
- **Decorative Elements:** Occasional use of fully circular "pill" shapes for tags and status indicators to provide visual variety.

## Components

- **Buttons:** Primary buttons use the Deep Emerald background with Cream text. They should have a subtle inner-glow (top-down) to feel slightly tactile. Secondary buttons use a Slate border with no fill.
- **Cards:** Cards should have no visible border. Use the Level 1 shadow and the secondary cream color against a slightly darker page background to define the area.
- **Input Fields:** Use a solid background slightly darker than the page (`#f1f5f9` or similar) with a bottom-only border that expands to a full outline on focus in Deep Emerald.
- **Chips/Tags:** Small, pill-shaped elements using a low-opacity version of the Emerald (Emerald Mist) for a tonal, sophisticated look.
- **Lists:** Use generous 16px padding between list items, separated by very faint 1px Slate dividers (10% opacity).
- **Specialty Component (The Signature Card):** A card variant featuring a serif "Display" title, an image with a large 24px radius, and a primary action button docked to the bottom right, overlapping the card boundary slightly.