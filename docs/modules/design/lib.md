# Design Library (SCSS/CSS Utilities)

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  lib utility module
</div>

Collection of SCSS mixins and CSS utilities for common design patterns.

## Installation

```bash
npm install @sky-modules/design
```

## Overview

This module provides reusable SCSS mixins and CSS utilities for common design patterns. Import individual utilities as needed in your stylesheets.

## Files

### absolute-center.scss / absolute-center.css

**Purpose:** Center element absolutely within parent

**Usage (SCSS):**
```scss
@import '@sky-modules/design/lib/absolute-center';

.centered {
  @include absolute-center;
}
```

**Usage (CSS):**
```css
@import '@sky-modules/design/lib/absolute-center.css';

.centered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

**Result:**
Element is perfectly centered both horizontally and vertically within positioned parent.

---

### breakpoints.scss

**Purpose:** Responsive breakpoint mixins

**Usage:**
```scss
@import '@sky-modules/design/lib/breakpoints';

.container {
  padding: 1rem;

  @include breakpoint(sm) {
    padding: 1.5rem;
  }

  @include breakpoint(md) {
    padding: 2rem;
  }

  @include breakpoint(lg) {
    padding: 3rem;
  }
}
```

**Available breakpoints:**
- `xs` - Extra small (mobile)
- `sm` - Small tablets
- `md` - Tablets
- `lg` - Desktops
- `xl` - Large desktops
- `2xl` - Extra large screens

**Custom breakpoints:**
```scss
@include breakpoint-custom(768px) {
  // Styles for screens >= 768px
}
```

---

### custom-scrollbar.scss

**Purpose:** Styled custom scrollbars

**Usage:**
```scss
@import '@sky-modules/design/lib/custom-scrollbar';

.scrollable {
  overflow-y: auto;
  @include custom-scrollbar;
}

// Custom colors
.scrollable-blue {
  overflow-y: auto;
  @include custom-scrollbar($track: #f0f0f0, $thumb: #3b82f6);
}
```

**Parameters:**
- `$track` - Scrollbar track color
- `$thumb` - Scrollbar thumb color
- `$width` - Scrollbar width (default: 12px)

**Result:**
Clean, modern scrollbar styling that works across browsers.

---

### fluid-font-size.scss

**Purpose:** Fluid typography that scales smoothly between min and max sizes

**Usage:**
```scss
@import '@sky-modules/design/lib/fluid-font-size';

h1 {
  @include fluid-font-size(
    $min-size: 1.5rem,
    $max-size: 3rem,
    $min-viewport: 320px,
    $max-viewport: 1200px
  );
}

// Simplified (uses default viewport sizes)
.title {
  @include fluid-font-size(1.25rem, 2rem);
}
```

**How it works:**
Font size smoothly scales between min and max based on viewport width using `clamp()`.

**Result:**
```css
h1 {
  font-size: clamp(1.5rem, 1.5rem + 1.5 * (100vw - 320px) / 880, 3rem);
}
```

---

### line-clamp.scss

**Purpose:** Truncate text to specified number of lines with ellipsis

**Usage:**
```scss
@import '@sky-modules/design/lib/line-clamp';

.description {
  @include line-clamp(3); // Limit to 3 lines
}

.title {
  @include line-clamp(2); // Limit to 2 lines
}
```

**Result:**
Text is truncated with "..." after the specified number of lines.

---

### pseudo.scss

**Purpose:** Simplified pseudo-element creation

**Usage:**
```scss
@import '@sky-modules/design/lib/pseudo';

.decorated {
  position: relative;

  &::before {
    @include pseudo;
    width: 20px;
    height: 20px;
    background: blue;
    top: 0;
    left: 0;
  }
}
```

**What it does:**
Automatically adds `content: ''` and `position: absolute` to pseudo-elements.

---

### triangle.scss

**Purpose:** Create CSS triangles using borders

**Usage:**
```scss
@import '@sky-modules/design/lib/triangle';

.arrow-down {
  @include triangle(10px, #3b82f6, down);
}

.arrow-up {
  @include triangle(15px, red, up);
}

.arrow-right {
  @include triangle(12px, green, right);
}

.arrow-left {
  @include triangle(8px, yellow, left);
}
```

**Parameters:**
- `$size` - Triangle size
- `$color` - Triangle color
- `$direction` - Direction (up, down, left, right)

**Result:**
Pure CSS triangle pointing in the specified direction.

---

### will-change.scss

**Purpose:** Optimize animations with will-change property

**Usage:**
```scss
@import '@sky-modules/design/lib/will-change';

.animated {
  @include will-change(transform, opacity);

  &:hover {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

// Single property
.simple {
  @include will-change(transform);
}
```

**What it does:**
Hints to browser which properties will animate, improving performance. Automatically removes hint after animation completes.

---

## Usage Patterns

### Combining Utilities

```scss
@import '@sky-modules/design/lib/breakpoints';
@import '@sky-modules/design/lib/fluid-font-size';
@import '@sky-modules/design/lib/line-clamp';

.card-title {
  @include fluid-font-size(1.25rem, 2rem);
  @include line-clamp(2);

  @include breakpoint(lg) {
    @include line-clamp(1);
  }
}
```

### With Brand Tokens

```scss
@import '@sky-modules/design/lib/custom-scrollbar';
@import '@sky-modules/design/lib/triangle';

.sidebar {
  @include custom-scrollbar(
    $track: var(--color-background-secondary),
    $thumb: var(--color-brand-primary)
  );
}

.tooltip::after {
  @include triangle(8px, var(--color-background-primary), down);
}
```

### Responsive Design

```scss
@import '@sky-modules/design/lib/breakpoints';
@import '@sky-modules/design/lib/absolute-center';

.modal {
  @include absolute-center;
  width: 90%;

  @include breakpoint(sm) {
    width: 80%;
  }

  @include breakpoint(md) {
    width: 60%;
  }

  @include breakpoint(lg) {
    width: 50%;
    max-width: 800px;
  }
}
```

## Best Practices

1. **Import only what you need** - Reduces CSS bundle size
2. **Use with CSS variables** - Integrate with design tokens
3. **Combine utilities** - Mix utilities for complex patterns
4. **Test cross-browser** - Some utilities have browser-specific implementations
5. **Use will-change sparingly** - Only for actively animating elements
6. **Validate breakpoints** - Ensure breakpoints match design system

## Migration from Sass

These utilities work with both Sass and modern CSS:

- **@import** - Use `@import` for Sass or `@use` for newer Sass
- **CSS Variables** - Utilities support CSS custom properties
- **Modern CSS** - Some utilities use modern features (clamp, line-clamp)

## Browser Support

Most utilities support all modern browsers (Chrome, Firefox, Safari, Edge). Some features:

- **fluid-font-size** - Requires `clamp()` support (all modern browsers)
- **line-clamp** - Uses `-webkit-line-clamp` (widely supported)
- **custom-scrollbar** - Uses `::-webkit-scrollbar` (Chromium/Safari) and `scrollbar-*` (Firefox)

## Related

- **Brand** - Design tokens for colors, spacing, typography
- **Box** - Component with built-in responsive props
- **Layout** - Layout computation engine
