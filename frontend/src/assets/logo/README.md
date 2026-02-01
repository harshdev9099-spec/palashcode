# Palash Academy Logo

## Instructions

Please place your Palash Academy logo file in this directory.

### Recommended Specifications:
- **File name**: `palash-academy-logo.png` (or `.jpg`, `.svg`)
- **Recommended dimensions**:
  - For header: 200x200px or higher (will be displayed at ~48-64px height)
  - For footer: 100x100px or higher (will be displayed at ~40px height)
- **Format**: PNG with transparent background (recommended) or JPG/SVG
- **File size**: Keep under 500KB for optimal loading

### After Adding the Logo:

1. Uncomment the import line in the following files:
   - `src/components/layout/Header.jsx` (line 4)
   - `src/components/layout/Footer.jsx` (line 2)

2. Uncomment the logo image tag:
   - In `Header.jsx`: Uncomment lines 21-22 and remove the placeholder div (lines 24-28)
   - In `Footer.jsx`: Uncomment the logo usage

### Example (in Header.jsx):
```jsx
// Before (with placeholder)
<div className="h-12 w-12 rounded-full bg-gradient-to-br from-secondary-400 to-accent-500 flex items-center justify-center shadow-lg">
  <span className="text-2xl">🍂</span>
</div>

// After (with actual logo)
<img
  src={logo}
  alt="Palash Academy"
  className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
/>
```

The logo has been integrated into the new autumn color theme that matches the warm, educational aesthetic of Palash Academy!
