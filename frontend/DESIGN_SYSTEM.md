# Palash Academy Design System

## Overview
A calm, professional, and trustworthy design system built with Tailwind CSS and shadcn/ui conventions, featuring a sophisticated slate-teal color palette.

---

## Color Palette

### Core Brand Colors

| Color | Hex | HSL | Usage |
|-------|-----|-----|-------|
| **Soft Teal** | `#98bac0` | `188 26% 67%` | Primary CTAs, buttons, links, brand identity |
| **Medium Teal** | `#7a9ba3` | `188 20% 57%` | Hover states for primary actions |
| **Light Teal** | `#d4e5e8` | `188 30% 85%` | Secondary backgrounds, highlights |
| **Accent Teal** | `#70a3ad` | `188 35% 55%` | Accent elements, badges, secondary actions |
| **Dark Slate** | `#3A4A54` | `215 25% 27%` | Primary text (light mode) |
| **Medium Slate** | `#6b7b88` | `215 16% 47%` | Secondary text |
| **Light Border** | `#dde3e7` | `214 20% 88%` | Borders, dividers, input outlines |

### Light Mode
- **Background**: Pure white (`#FFFFFF`) - Clean, minimalist foundation
- **Cards**: Pure white (`#FFFFFF`) - Professional look with clear hierarchy
- **Text**: Dark slate (`#3A4A54`) - Excellent readability with calm tone

### Dark Mode
- **Background**: Deep slate (`#181f26`) - Easy on eyes during extended study sessions
- **Cards**: Elevated slate (`#252d35`) - Subtle depth without distraction
- **Text**: Light teal gray (`#dde9ec`) - Maintains clarity in dark mode
- **Accents**: Brighter teal - Enhanced visibility for important elements

---

## Design Philosophy

### 1. Educational & Trustworthy
- **Clean layouts** with plenty of breathing room
- **Professional typography** hierarchy (Inter for body, Poppins for headings)
- **Subtle animations** that enhance without distracting
- **Consistent spacing** creates predictable, learnable interface

### 2. Calm & Student-Friendly
- **Cool slate-teal palette** for a professional, focused environment
- **Clean backgrounds** (pure white, minimalist)
- **Rounded corners** (`0.5rem` default) for approachability
- **Gradual transitions** (200-300ms) feel natural and responsive

### 3. Modern Without Being Flashy
- **No neon or overly saturated colors**
- **Purposeful use of teal** - Reserved for primary actions and emphasis
- **Muted slate tones** - Create calm, distraction-free learning space
- **Clean design** that promotes focus

### 4. WCAG Accessible
- **AA compliant** color contrast ratios
- **Clear focus states** with visible rings
- **Readable text sizes** (minimum 14px)
- **Proper heading hierarchy**

---

## CSS Variables Structure

### shadcn/ui Compatible
All colors use HSL format for easy manipulation:

```css
:root {
  --primary: 188 26% 67%;      /* #98bac0 - Soft teal */
  --secondary: 188 30% 85%;    /* #d4e5e8 - Light teal */
  --accent: 188 35% 55%;       /* #70a3ad - Medium teal */
  --background: 0 0% 100%;     /* Pure white */
  --foreground: 215 25% 27%;   /* Dark slate */
  /* ... */
}
```

### Advantages
- **Theme switching**: Easy light/dark mode toggle
- **Opacity control**: `bg-primary/20` for 20% opacity
- **Consistency**: All components inherit from variables
- **Flexibility**: Update theme globally by changing variables

---

## Typography

### Font Stack
```javascript
{
  sans: ['Inter', 'system-ui', 'sans-serif'],      // Body text
  heading: ['Poppins', 'sans-serif'],              // Section headings
  display: ['Montserrat', 'sans-serif'],           // Hero titles
}
```

### Usage
- **Inter**: Body text, UI elements, navigation
- **Poppins**: Card titles, section headings, subheadings
- **Montserrat**: Large hero text, marketing copy (use sparingly)

### Scale
- Display: `text-5xl` (48px) to `text-6xl` (60px)
- Heading 1: `text-4xl` (36px)
- Heading 2: `text-3xl` (30px)
- Heading 3: `text-2xl` (24px)
- Body: `text-base` (16px)
- Small: `text-sm` (14px)

---

## Component Patterns

### Buttons
- **Primary**: Red background, white text - Most important actions
- **Secondary**: Yellow background, dark text - Alternative actions
- **Accent**: Orange background, white text - Special features
- **Outline**: Red border, red text - Less emphasis
- **Ghost**: No background, red text on hover - Minimal interference

### Cards
- **Standard**: White background, subtle border, shadow on hover
- **Elevated**: Darker background in dark mode for hierarchy
- **Feature**: Icon + title + description with hover lift effect
- **Course**: Image + content + CTA button in structured layout

### Forms
- **Inputs**: Border focus state with ring color matching primary
- **Labels**: Medium weight, slightly smaller than input text
- **Validation**: Green for success, red for error, orange for warning

---

## Spacing & Layout

### Container
- **Max width**: 1400px (2xl breakpoint)
- **Padding**: 2rem (32px) on sides
- **Centered**: Automatically centered in viewport

### Common Gaps
- **Tight**: `gap-2` (8px) - Within button groups
- **Normal**: `gap-4` (16px) - Between card elements
- **Relaxed**: `gap-6` (24px) - Between sections
- **Loose**: `gap-8` (32px) - Between major sections

---

## Animations

### Hover Effects
```css
.hover-lift /* Lifts card 5px up with enhanced shadow */
```

### Fade Animations
```javascript
{
  'fade-in': 'fadeIn 0.5s ease-in',
  'fade-in-up': 'fadeInUp 0.6s ease-out',
}
```

### Custom
```css
.gradient-autumn /* Yellow to orange gradient */
.gradient-text   /* Red to orange gradient text */
```

---

## Responsive Breakpoints

```javascript
{
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Laptop
  xl: '1280px',  // Desktop
  2xl: '1400px', // Large desktop (container max)
}
```

---

## Usage Best Practices

### DO ✅
- Use semantic color names (`bg-primary`, `text-foreground`)
- Maintain consistent spacing with Tailwind utilities
- Test in both light and dark modes
- Use hover effects to indicate interactivity
- Follow the component examples in THEME_EXAMPLES.md

### DON'T ❌
- Hardcode hex colors in components
- Mix gradient directions without purpose
- Overuse animations
- Ignore accessibility requirements
- Use neon or overly bright colors

---

## File Structure

```
frontend/src/
├── index.css           # Theme variables, base styles, utilities
├── App.css             # Global animations
├── tailwind.config.js  # Tailwind configuration
└── THEME_EXAMPLES.md   # Component code examples
```

---

## Quick Reference

### Common Classes
```javascript
// Primary button
"bg-primary text-primary-foreground hover:bg-primary/90"

// Card
"bg-card text-card-foreground rounded-lg shadow-lg border border-border"

// Input
"bg-background border border-input focus:ring-2 focus:ring-ring"

// Badge
"bg-accent/10 text-accent border border-accent/20"
```

### Gradient Background
```javascript
"bg-gradient-to-br from-secondary to-accent"
```

### Text Gradient
```javascript
"gradient-text" // Pre-built utility class
```

---

## Migration Notes

If updating existing components:
1. Replace hardcoded colors with semantic tokens
2. Replace `className` strings with theme variables
3. Test thoroughly in dark mode
4. Verify focus states are visible
5. Check mobile responsiveness

---

## Support

For questions or theme customization:
1. Check [THEME_EXAMPLES.md](THEME_EXAMPLES.md) for component patterns
2. Review [index.css](src/index.css) for available CSS variables
3. Consult [tailwind.config.js](tailwind.config.js) for extended utilities

---

**Design System Version**: 1.0
**Last Updated**: January 2026
**Maintained by**: Palash Academy Team
