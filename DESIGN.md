---
name: Mental Scrapbook
colors:
  surface: '#faf9f7'
  surface-dim: '#dadad8'
  surface-bright: '#faf9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f1'
  surface-container: '#efeeec'
  surface-container-high: '#e9e8e6'
  surface-container-highest: '#e3e2e0'
  on-surface: '#1a1c1b'
  on-surface-variant: '#474741'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
  outline: '#777770'
  outline-variant: '#c8c7bf'
  surface-tint: '#5f5e5b'
  primary: '#181916'
  on-primary: '#ffffff'
  primary-container: '#2d2d2a'
  on-primary-container: '#969490'
  inverse-primary: '#c8c6c2'
  secondary: '#536252'
  on-secondary: '#ffffff'
  secondary-container: '#d4e4d0'
  on-secondary-container: '#586756'
  tertiary: '#16152f'
  on-tertiary: '#ffffff'
  tertiary-container: '#2b2a45'
  on-tertiary-container: '#9391b1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2dd'
  primary-fixed-dim: '#c8c6c2'
  on-primary-fixed: '#1c1c19'
  on-primary-fixed-variant: '#474743'
  secondary-fixed: '#d7e7d2'
  secondary-fixed-dim: '#bbcbb7'
  on-secondary-fixed: '#111f12'
  on-secondary-fixed-variant: '#3c4a3b'
  tertiary-fixed: '#e2dfff'
  tertiary-fixed-dim: '#c6c3e5'
  on-tertiary-fixed: '#191932'
  on-tertiary-fixed-variant: '#454460'
  background: '#faf9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e3e2e0'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding-mobile: 24px
  container-padding-desktop: 80px
  section-gap: 64px
  element-gap: 24px
---

## Brand & Style

The design system is built for a premium AI life assistant that functions as both a high-end personal journal and a next-generation productivity tool. The brand personality is serene, intelligent, and deeply personal. It aims to evoke a "mental exhale"—a feeling of clarity, calm, and cognitive offloading the moment the interface is engaged.

The aesthetic leans heavily into **High-End Minimalism** with elements of **Glassmorphism**. It prioritizes spaciousness over density, using quality typography and subtle tactile metaphors to create a digital environment that feels as intentional as a physical linen-bound notebook. The visual language avoids the frantic energy of typical productivity tools, instead opting for a "digital sanctuary" approach that values the user's focus and emotional state.

## Colors

The palette is rooted in serene neutrals to maintain a low-arousal environment. 
- **Primary:** A deep charcoal (#2D2D2A) used for maximum legibility in typography.
- **Background:** A soft, warm white (#F9F8F6) that reduces eye strain compared to pure white.
- **Accents:** Ethereal, muted tones represent different data sources: 
    - **Muted Sage (#98A895):** For health, nature, and growth-related data.
    - **Soft Lavender (#A7A5C6):** For creative thoughts, dreams, and reflection.
    - **Hazy Morning Blue (#9BB2C0):** For scheduled tasks, professional life, and external integrations.

Color should be used sparingly as a "wash" or a subtle indicator rather than a solid fill, maintaining the minimalist integrity.

## Typography

This design system employs a high-contrast typographic pairing to balance editorial elegance with functional clarity.

**Playfair Display** is the "Journal" voice. It is used for headlines and reflective entries. Its high-contrast serifs provide a sense of luxury and timelessness. For larger display sizes, use tighter letter spacing to emphasize its sophisticated silhouette.

**Hanken Grotesk** is the "Assistant" voice. This contemporary sans-serif handles all functional text, data inputs, and UI labels. It is chosen for its exceptional legibility and neutral, precise character. 

Hierarchy is established through scale and whitespace rather than weight. Keep body text line heights generous (1.6) to allow the layout to "breathe."

## Layout & Spacing

The layout philosophy rejects rigid, dense grids in favor of a **Fluid, Contextual Model** with exaggerated margins. 

- **Desktop:** Use a centered, focused column (max-width 960px) for journaling and reading, with generous "negative space" on the periphery (80px margins). 
- **Mobile:** Maintain a minimum 24px side margin to ensure content feels un-cramped.
- **Rhythm:** Utilize an 8px base unit, but favor larger multiples (24, 40, 64) for vertical rhythm to create a sense of significant separation between different "thoughts" or data types.

Elements should feel like they are "floating" on the page. Use asymmetrical compositions where possible to mimic the organic feel of a physical scrapbook.

## Elevation & Depth

Hierarchy is communicated through **Tonal Layers** and **Glassmorphism** rather than traditional shadows.

1.  **The Canvas (Level 0):** The base neutral background (#F9F8F6).
2.  **Floating Panes (Level 1):** Semi-transparent surfaces (white at 70% opacity) with a `20px` backdrop blur. These represent active thoughts or input areas.
3.  **Depth Cues:** Instead of drop shadows, use **Ambient Shadows**—soft, extremely diffused shadows (Blur: 40px, Opacity: 4%) with a hint of the secondary or tertiary accent color to suggest a soft glow rather than a hard lift.

Avoid heavy borders. If separation is required, use a 1px stroke in a shade only slightly darker than the surface it sits upon.

## Shapes

The shape language is organic and soft. Standard components use a **Rounded** (0.5rem) base to remove the "aggression" of sharp corners. 

For larger containers, cards, and image treatments, use `rounded-xl` (1.5rem) or even custom organic radii (e.g., slightly inconsistent corner radii) to reinforce the scrapbook feel. Buttons and interactive chips should utilize a full pill-shape (round-full) to provide a tactile, "pebble-like" quality that invites interaction without feeling overly technical.

## Components

### Buttons & Interaction
Primary actions use pill-shaped containers with the Primary color and White text. Secondary actions use the Glassmorphic style: a semi-transparent background with a subtle 1px border. Hover states should involve a slight increase in backdrop blur rather than a significant color shift.

### Cards & Thought Blocks
Cards are the primary container for AI-generated insights. They should have no visible border, using only the Level 1 elevation (glassmorphism) and the softest possible ambient shadow. The top edge of a card may feature a subtle color-wash gradient (2px height) in Sage, Lavender, or Blue to categorize the source.

### Input Fields
Inputs are minimalist—a single bottom border or a very soft tinted well. The focus state should not be a harsh blue ring, but a gentle expansion of the bottom border and a shift in the background tint to the "Hazy Morning Blue."

### Lists & Timelines
Avoid vertical lines for timelines. Use spacing and small, organic dots to indicate chronological flow. List items should have generous vertical padding (16px+) to ensure the "Scrapbook" never feels cluttered.

### The "Pulse" (Unique Component)
A small, glowing ambient element in the corner of the UI that shifts colors between the accent palette to indicate the AI is "thinking" or "processing" the user's mental offload.