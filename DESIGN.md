---
name: Irabor
description: "A personal frontend-development portfolio with readable work histories and project case studies."
colors:
  primary: "#7901b1"
  primary-hover: "#9a46c1"
  primary-active: "#2e0044"
  primary-dark: "#ff50b3"
  primary-hover-dark: "#ff8ece"
  primary-active-dark: "#e90084"
  background: "#ffffff"
  surface: "#f2f2f2"
  text-primary: "#19141f"
  text-secondary: "#3d3d3d"
  border: "rgba(63, 63, 63, 0.22)"
  border-strong: "#3f3f3f"
  row-hover: "rgba(154, 70, 193, 0.09)"
  background-dark: "#080714"
  surface-dark: "#110d1d"
  text-primary-dark: "#ffffff"
  text-secondary-dark: "#dad0ea"
  border-dark: "rgba(255, 255, 255, 0.16)"
  border-strong-dark: "rgba(255, 255, 255, 0.66)"
  row-hover-dark: "rgba(255, 80, 179, 0.12)"
  nav-glass-surface: "rgba(255, 255, 255, 0.7)"
  nav-glass-border: "rgba(70, 50, 85, 0.17)"
  nav-glass-highlight: "rgba(255, 255, 255, 0.9)"
  nav-glass-hover: "rgba(121, 1, 177, 0.07)"
  nav-glass-surface-dark: "rgba(12, 9, 22, 0.76)"
  nav-glass-border-dark: "rgba(255, 255, 255, 0.19)"
  nav-glass-highlight-dark: "rgba(255, 255, 255, 0.13)"
  nav-glass-hover-dark: "rgba(255, 255, 255, 0.09)"
typography:
  display:
    fontFamily: "Inter, Manrope, sans-serif"
    fontSize: "clamp(3rem, 4.5vw, 4rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Inter, Manrope, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Inter, Manrope, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Inter, Manrope, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "0.1em"
  ui:
    fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.6
    letterSpacing: "0"
  case-study-display:
    fontFamily: "Manrope, Helvetica Neue, sans-serif"
    fontSize: "clamp(2.6rem, 6vw, 4rem)"
    lineHeight: 1.12
    letterSpacing: "-0.035em"
rounded:
  "4": "4px"
  "8": "8px"
  "11": "11px"
  "12": "12px"
  "14": "14px"
  "16": "16px"
  full: "999px"
spacing:
  "4": "4px"
  "8": "8px"
  "12": "12px"
  "16": "16px"
  "20": "20px"
  "24": "24px"
  "32": "32px"
  "48": "48px"
  "64": "64px"
  "80": "80px"
  "120": "120px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background}"
    rounded: "{rounded.4}"
    padding: "0 14px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
  button-secondary:
    textColor: "{colors.text-primary}"
    rounded: "{rounded.4}"
    padding: "0 14px"
  button-ghost:
    textColor: "{colors.text-primary}"
    rounded: "{rounded.4}"
    padding: "0 14px"
  button-text:
    textColor: "{colors.text-primary}"
    rounded: "{rounded.4}"
    padding: "0"
  navigation:
    backgroundColor: "{colors.nav-glass-surface}"
    rounded: "{rounded.16}"
    padding: "4px"
  navigation-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background}"
    rounded: "{rounded.11}"
    typography: "{typography.ui}"
  theme-toggle:
    textColor: "{colors.text-primary}"
    rounded: "10px"
    size: "40px"
  technology-tag:
    backgroundColor: "{colors.row-hover}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    padding: "3px 11px"
  project-row:
    textColor: "{colors.text-primary}"
    rounded: "{rounded.8}"
  search-field:
    textColor: "{colors.text-primary}"
    rounded: "0"
---

# Design System — Irabor

## Overview

**Creative North Star — “Brittany Chiang-inspired portfolio”**

The portfolio follows the user’s Brittany Chiang reference through a persistent personal introduction, compact experience entries, and a readable project list. White and violet define the light theme. Near-black, pale lavender, and pink define the dark theme.

The floating navigation uses the existing glass treatment. The main profile uses Inter, while navigation and case-study pages use Manrope. Project screenshots, factual descriptions, and generous section spacing carry the visual hierarchy.

**Key characteristics**

- A persistent identity column accompanies the desktop reading flow.
- Compact project and experience rows keep the work easy to scan.
- Glass surfaces are concentrated in the floating navigation controls.
- Both themes share typography, spacing, and component geometry.

## Colors

Violet and pink provide the theme-specific accent against restrained neutral surfaces.

### Primary

- **Violet** supplies light-theme links, active navigation, focus indicators, and technology labels.
- **Pink** supplies the same roles in the dark theme.
- Hover and active values belong to the corresponding theme. The on-primary text uses the page background color.

### Neutral

- **White and near-black** are the page backgrounds.
- **Dark ink and white** carry primary text. Charcoal and pale lavender carry secondary text.
- Low-opacity accent fills identify hovered rows and technology tags.
- The glass surface, border, highlight, and hover tokens belong to the header controls. Their dark variants provide equivalent contrast on the dark canvas.

The frontmatter lists the light values and their explicitly named dark counterparts. Runtime components use the semantic CSS variables from the selected theme.

## Typography

Inter is the profile’s locally hosted variable font. Manrope is the locally hosted variable font for the shell and case-study pages.

- **Display** sets the profile name with tight tracking and a compact line height. At tablet widths it uses a responsive size (clamp(2.75rem, 7vw, 3.75rem)).
- **Title** sets profile project and experience titles.
- **Body** sets profile paragraphs. Project and experience descriptions use a smaller size (0.875rem) with the same generous line height (1.75).
- **Label** sets uppercase section headings.
- **UI** sets navigation labels. The active item uses the accent fill and on-primary text.
- **Case-study display** sets article hero headings. Supporting case-study prose keeps a reading measure (72ch).
- The profile introduction has a compact measure (33ch), expanding at tablet widths (44ch). Dates use tabular numerals.

## Layout

The shared shell has a centered content width (1120px) with responsive side gutters (clamp(24px, 5vw, 72px)). At widths of 720px and below, the main content uses side gutters (24px).

The desktop profile has two columns (0.8fr / 1.2fr) and a responsive gap (clamp(56px, 7vw, 104px)). The identity column is sticky below the fixed header with an additional offset (48px). The reading column follows About, Experience, and Projects. Its sections have a spacious vertical interval (88px).

At widths from 901px through 1100px, the column ratio becomes narrower on the identity side (0.7fr / 1.3fr) with a reduced gap (48px). At 900px and below, the profile stacks into one column with a maximum width (680px), the identity scrolls with the page, and section spacing reduces (72px). At 540px and below, experience dates stack above their descriptions, project copy precedes its thumbnail, and section spacing reduces again (64px).

Desktop content begins with 32px main padding, and the profile identity sticks at 48px. Mobile section headings span the viewport and stick to its top edge with 18px vertical padding and solid theme-colored backgrounds. Navigation and the status-gradient overlay are temporarily commented out in AppShell. Safe-area spacing is zero. Homepage content ends at the footer, with zero trailing layout padding. Desktop section headings are visually hidden and retain accessible section names.

## Elevation & Depth

Profile content uses spacing, typography, and subtle hover fills to establish hierarchy. Compact project rows gain an accent-tinted background on fine-pointer hover. The header glass uses backdrop blur (20px), saturation (150%), a fine border, an inset highlight, and a soft shadow.

- **Light navigation shadow** uses a diffuse shadow (0 6px 22px rgba(33, 16, 51, 0.07)).
- **Dark navigation shadow** uses a deeper shadow (0 8px 26px rgba(0, 0, 0, 0.2)).
- Shared raised buttons use an accent offset shadow (4px 4px 0). Pressing a button moves it into that offset.
- Reduced-transparency, increased-contrast, and forced-color preferences use opaque header surfaces with stronger borders.

## Shapes

The navigation group uses softly rounded corners (16px). Its active link has a slightly tighter radius (11px), while the control group and résumé link use matching corners (14px). The logo occupies a clear square hit area (48px) and a compact mark height (38px).

Profile project thumbnails have small corners (4px), their links have a modest radius (8px), and their expanded hover surfaces have softer corners (12px). Technology tags use pill geometry (999px). Shared supporting buttons use small corners (4px). Search fields use a square, bottom-border treatment.

## Components

### Navigation

The SiteHeader component is temporarily disabled at its AppShell entry point. The logo sits beside the profile name. Mobile section headings stick to the top with solid, theme-aware backgrounds.

At 900px and below, a combined theme/menu control opens a full-screen navigation panel. Links use larger Manrope text (clamp(1.5rem, 5vw, 2.25rem)) and generous target height (64px). The modal traps focus, closes with Escape, restores focus to the trigger, and locks background scrolling.

### Theme toggle

The theme button uses a transparent square hit area inside the glass control group. Desktop dimensions are compact (40px), expanding for mobile touch (44px). The icon is small (18px), with a visible keyboard focus outline. Its hover presentation stays neutral.

### Experience rows

Dates and role details form a compact grid with a max-content date column and a 24px gap. Dates stay on one line. Current role and company lead each entry, followed by previous roles, a concise summary, and technology tags. Rows use open space and a repeated vertical gap of 38px.

### Project rows

Each compact row links to its case study. A thumbnail column (128px) sits beside title, excerpt, and up to three tags with a gap (24px). The intermediate thumbnail width is smaller (104px). Images retain a landscape ratio (3 / 2) and contain the original screenshot. Mobile thumbnails have a bounded width (200px).

The hover background extends around the row (16px), reducing on small screens (12px). A small diagonal arrow shifts along its direction (2px) on fine-pointer hover. The thumbnail keeps its original scale in this compact presentation.

### Technology tags

Profile tags use a low-opacity accent fill and accent text, a compact minimum height (27px), and small padding (3px 11px). Their text is deliberately small (0.6875rem), with medium variable weight (550). Forced-color mode supplies a visible border.

### Text links and supporting buttons

The profile résumé, archive, and company links use diagonal arrows. The homepage displays every current-year project. The archive at /archive lists earlier years newest first, including year-only dates, with technologies and every available project link. On phones, Year and Project form the table, with project titles linking to case studies. Desktop external project links sit side by side.

Column headings use the homepage label typography and 18px vertical padding on mobile. Desktop headings have an exact 52.33px height. Solid native table cells provide the sticky surface, with no divider beneath the headings or the final row. The archive back link uses plain text with zero margin and scrolls with the page. Case studies include solid sticky back links, pinned 12px from the top. Left-pointing arrows move 4px left on hover or keyboard focus. Diagonal arrows move up and right, and right-pointing arrows move right. Links retain plain text decoration in every interaction state.

The profile footer contains right-aligned copyright text. A 56px circular solid contact toggle sits 24px from the bottom and right edges. It renders through a body portal at z-index 1000 above page layers. Opening reveals 48px GitHub and email links in an upward fan with a 55ms stagger. Both opening and closing use matching 280ms transitions. The speech-bubble icon cross-fades into a close icon. Escape, outside interaction, leaving keyboard focus, and link selection dismiss the links. Closed links are inert. Reduced-motion preferences remove the reveal transitions.

### Search fields

Supporting collection pages use a labeled transparent field with a bottom border and a minimum height (44px). Hover changes the border to the accent hover value. Focus uses the accent border. Placeholder copy uses the muted text token.

### Motion

Shared state changes use the fast transition (140ms ease). Profile arrows and row fills use brief transitions (180ms). The mobile panel enters over a short eased interval (260ms) and exits quickly (140ms). Reduced-motion preferences disable page, navigation, and arrow animation.

Homepage content enters with a 350ms fade, a 10px rise, and a 4px blur resolving to sharp text. The initial delay is 40ms, followed by 50ms staggers. Section containers retain stable geometry. Direct hash links skip the entrance, and anchor positioning waits for fonts to settle. The archive has no route animation, transforms, or filters so sticky table content remains on stable paint layers. Other routes use a short entrance (280ms) with subtle upward movement (8px).

## Do's and Don'ts

### Do

- Do use the semantic CSS variables so controls and content follow the selected theme.
- Do scope Inter to the profile content and use Manrope for navigation and case-study pages.
- Do preserve clear focus indicators, reduced-motion behavior, and opaque accessibility fallbacks.
- Do retain the original project screenshots and their aspect ratio.

### Don't

- Don’t add a glass surface or border around the header logo.
- Don’t add a hover color, background, or movement to the theme toggle.
- Don’t extend the floating navigation glass across the full header width.
- Don’t add resting panels or heavy shadows to the compact profile rows.

