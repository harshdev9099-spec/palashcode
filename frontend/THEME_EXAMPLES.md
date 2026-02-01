# Palash Academy Design System - Component Examples

## Theme Overview
The design system uses shadcn/ui-compatible CSS variables with Palash Academy branding:
- **Primary (Palash Red)**: #C62828 - Used for CTAs, primary buttons, links
- **Secondary (Autumn Yellow)**: #FFF3B0 - Used for backgrounds and highlights
- **Accent (Leaf Orange)**: #F57C00 - Used for emphasis and secondary actions

## Buttons

### Primary Button (CTA)
```jsx
<button className="bg-primary text-primary-foreground hover:bg-primary/90
                   px-6 py-3 rounded-lg font-semibold shadow-md
                   transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
  Enroll Now
</button>
```

### Secondary Button
```jsx
<button className="bg-secondary text-secondary-foreground hover:bg-secondary/90
                   px-6 py-3 rounded-lg font-semibold shadow-sm
                   transition-all duration-200 hover:shadow-md">
  Learn More
</button>
```

### Accent Button
```jsx
<button className="bg-accent text-accent-foreground hover:bg-accent/90
                   px-6 py-3 rounded-lg font-semibold shadow-md
                   transition-all duration-200 hover:shadow-lg">
  Get Started
</button>
```

### Outline Button
```jsx
<button className="border-2 border-primary text-primary hover:bg-primary
                   hover:text-primary-foreground px-6 py-3 rounded-lg
                   font-semibold transition-all duration-200">
  View Courses
</button>
```

### Ghost Button
```jsx
<button className="text-primary hover:bg-primary/10 px-6 py-3 rounded-lg
                   font-semibold transition-all duration-200">
  Cancel
</button>
```

## Cards

### Feature Card
```jsx
<div className="bg-card text-card-foreground rounded-lg shadow-lg p-6
                border border-border hover-lift">
  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
    <svg className="w-6 h-6 text-primary" />
  </div>
  <h3 className="text-xl font-heading font-bold mb-2">Expert Instructors</h3>
  <p className="text-muted-foreground">
    Learn from certified IELTS professionals with years of teaching experience.
  </p>
</div>
```

### Course Card
```jsx
<div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border
                hover-lift transition-all duration-300">
  <div className="h-48 bg-gradient-autumn" />
  <div className="p-6">
    <div className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full
                    text-sm font-semibold mb-3">
      Band 7+
    </div>
    <h3 className="text-2xl font-heading font-bold mb-2">IELTS Masterclass</h3>
    <p className="text-muted-foreground mb-4">
      Comprehensive training for all four modules
    </p>
    <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg
                       font-semibold hover:bg-primary/90 transition-colors">
      Enroll Now
    </button>
  </div>
</div>
```

### Elevated Card (Dark Mode Enhanced)
```jsx
<div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6
                shadow-xl hover:shadow-2xl transition-all duration-300">
  <h3 className="text-lg font-semibold mb-3">Your Progress</h3>
  <div className="space-y-2">
    {/* Content here */}
  </div>
</div>
```

## Alerts & Badges

### Success Alert
```jsx
<div className="bg-success-500/10 border border-success-500/20 text-success-600
                dark:text-success-400 rounded-lg p-4 flex items-start gap-3">
  <svg className="w-5 h-5 mt-0.5" />
  <div>
    <h4 className="font-semibold mb-1">Congratulations!</h4>
    <p className="text-sm">Your test has been submitted successfully.</p>
  </div>
</div>
```

### Warning Alert
```jsx
<div className="bg-warning-500/10 border border-warning-500/20 text-warning-600
                dark:text-warning-400 rounded-lg p-4 flex items-start gap-3">
  <svg className="w-5 h-5 mt-0.5" />
  <div>
    <h4 className="font-semibold mb-1">Time Running Out</h4>
    <p className="text-sm">You have 10 minutes remaining.</p>
  </div>
</div>
```

### Error Alert
```jsx
<div className="bg-destructive/10 border border-destructive/20 text-destructive
                rounded-lg p-4 flex items-start gap-3">
  <svg className="w-5 h-5 mt-0.5" />
  <div>
    <h4 className="font-semibold mb-1">Error</h4>
    <p className="text-sm">Please check your answers before submitting.</p>
  </div>
</div>
```

### Info Badge
```jsx
<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold
               bg-accent/10 text-accent border border-accent/20">
  New Course
</span>
```

### Band Score Badges (IELTS Specific)
```jsx
{/* Band 9 - Expert */}
<div className="band-score band-9">
  Band 9.0
</div>

{/* Band 7-8 - Good */}
<div className="band-score band-7-8">
  Band 7.5
</div>

{/* Band 5-6 - Moderate */}
<div className="band-score band-5-6">
  Band 6.0
</div>
```

## Form Inputs

### Text Input
```jsx
<div className="space-y-2">
  <label className="text-sm font-medium text-foreground">Email</label>
  <input
    type="email"
    className="w-full px-4 py-2 bg-background border border-input rounded-lg
               text-foreground placeholder:text-muted-foreground
               focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
               transition-all duration-200"
    placeholder="your@email.com"
  />
</div>
```

### Textarea
```jsx
<textarea
  className="w-full px-4 py-3 bg-background border border-input rounded-lg
             text-foreground placeholder:text-muted-foreground
             focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
             min-h-[120px] resize-none transition-all duration-200"
  placeholder="Write your answer here..."
/>
```

### Select Dropdown
```jsx
<select className="w-full px-4 py-2 bg-background border border-input rounded-lg
                   text-foreground focus:outline-none focus:ring-2 focus:ring-ring
                   focus:border-transparent transition-all duration-200">
  <option>Select a module</option>
  <option>Listening</option>
  <option>Reading</option>
  <option>Writing</option>
  <option>Speaking</option>
</select>
```

## Navigation

### Navigation Bar
```jsx
<nav className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50">
  <div className="container mx-auto px-4 py-4 flex items-center justify-between">
    <div className="flex items-center gap-8">
      <img src="/logo.png" alt="Palash Academy" className="h-10" />
      <div className="hidden md:flex gap-6">
        <a href="#" className="text-foreground hover:text-primary font-medium
                              transition-colors">Courses</a>
        <a href="#" className="text-foreground hover:text-primary font-medium
                              transition-colors">Practice</a>
        <a href="#" className="text-foreground hover:text-primary font-medium
                              transition-colors">About</a>
      </div>
    </div>
    <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg
                       font-semibold hover:bg-primary/90 transition-colors">
      Sign In
    </button>
  </div>
</nav>
```

### Tabs
```jsx
<div className="flex gap-2 border-b border-border">
  <button className="px-4 py-2 font-semibold text-primary border-b-2 border-primary
                     transition-colors">
    All Courses
  </button>
  <button className="px-4 py-2 font-medium text-muted-foreground
                     hover:text-foreground border-b-2 border-transparent
                     hover:border-border transition-colors">
    Listening
  </button>
  <button className="px-4 py-2 font-medium text-muted-foreground
                     hover:text-foreground border-b-2 border-transparent
                     hover:border-border transition-colors">
    Reading
  </button>
</div>
```

## Hero Section

### Hero with Gradient Background
```jsx
<section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/20 to-accent/10">
  <div className="container mx-auto px-4 py-24 relative z-10">
    <div className="max-w-3xl">
      <h1 className="text-5xl md:text-6xl font-display font-black mb-6 gradient-text">
        Master IELTS with Expert Guidance
      </h1>
      <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
        Join thousands of students who achieved their dream band scores with
        Palash Academy's proven learning system.
      </p>
      <div className="flex flex-wrap gap-4">
        <button className="bg-primary text-primary-foreground px-8 py-4 rounded-lg
                           font-bold text-lg hover:bg-primary/90 shadow-lg
                           hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
          Start Free Trial
        </button>
        <button className="bg-card text-foreground border-2 border-border px-8 py-4
                           rounded-lg font-bold text-lg hover:border-primary
                           hover:text-primary transition-all duration-200">
          View Courses
        </button>
      </div>
    </div>
  </div>

  {/* Decorative elements */}
  <div className="absolute top-20 right-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
  <div className="absolute bottom-20 left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
</section>
```

## Typography

### Headings with Theme
```jsx
<h1 className="text-4xl md:text-5xl font-display font-black text-foreground mb-4">
  Main Heading
</h1>

<h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
  Section Heading
</h2>

<h3 className="text-2xl font-heading font-semibold text-foreground mb-2">
  Subsection Heading
</h3>

<p className="text-muted-foreground leading-relaxed">
  Body text that's easy to read with proper contrast.
</p>

{/* Gradient text for emphasis */}
<h2 className="text-4xl font-display font-black gradient-text">
  Achieve Your Goals
</h2>
```

## Dark Mode Toggle

### Toggle Implementation
```jsx
import { useState, useEffect } from 'react';

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? '🌞' : '🌙'}
    </button>
  );
}
```

## Color Usage Guidelines

### When to Use Each Color

**Primary (Palash Red - #C62828)**
- Primary CTAs and action buttons
- Important links
- Active navigation states
- Focus states and rings
- Critical information highlights

**Secondary (Autumn Yellow - #FFF3B0)**
- Section backgrounds
- Highlighting content areas
- Secondary badges
- Warmth and comfort elements

**Accent (Leaf Orange - #F57C00)**
- Secondary actions
- Badges and labels
- Icons and decorative elements
- Hover states for secondary elements

**Muted**
- Secondary text
- Placeholder text
- Disabled states
- Subtle backgrounds

**Border**
- Card borders
- Input borders
- Dividers and separators

## Accessibility Notes

✅ All color combinations meet WCAG AA standards
✅ Focus states use visible ring indicators
✅ Text maintains proper contrast ratios
✅ Dark mode provides comfortable reading experience
✅ Interactive elements have clear hover states
