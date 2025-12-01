# Canvas Core Renderers

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  renderers utility module
</div>

<PlaygroundLink id="canvas" label="Open Canvas Playground" />


Specialized renderer modules for Canvas core. These modules were extracted from `CanvasRenderer.ts` to improve modularity and maintainability.


## Installation

```bash
npm install @sky-modules/core
```

## Usage

```typescript
import { renderers } from '@sky-modules/core'
```

## Modules

### ScrollbarRenderer

**File:** `ScrollbarRenderer.ts`

Renders scrollbars for scrollable canvas containers with customizable styling.

**Features:**
- Pill-shaped scrollbar design (fully rounded corners)
- Configurable colors, dimensions, and margins
- Automatic thumb size calculation based on content/viewport ratio
- Smooth scrollbar track and thumb rendering
- Pixel-perfect rendering with devicePixelRatio support

**Usage:**
```typescript
import { ScrollbarRenderer } from './renderers/ScrollbarRenderer'

const scrollbarRenderer = new ScrollbarRenderer(context, {
  width: 12,
  margin: 2,
  trackColor: 'rgba(0, 0, 0, 0.1)',
  thumbColor: 'rgba(0, 0, 0, 0.3)',
  minThumbHeight: 30
})

// Render scrollbar for a scrollable mesh
scrollbarRenderer.render({
  object: mesh,
  x: meshX,
  y: meshY,
  pixelRatio: window.devicePixelRatio
})
```

**Parameters:**
- `object` - Mesh with `_contentHeight`, `_boxHeight`, `_boxWidth`, `_scrollY` properties
- `x`, `y` - Position in canvas coordinates
- `pixelRatio` - Device pixel ratio for crisp rendering

**How it works:**
1. Calculates scrollbar dimensions based on box padding
2. Determines thumb height from content/box ratio
3. Positions thumb based on scroll progress
4. Draws rounded rectangle track and thumb

### ScrollbarConfig

**File:** `ScrollbarConfig.ts`

Configuration interface and defaults for scrollbar rendering.

**Interface:**
```typescript
interface ScrollbarConfig {
  width: number           // Scrollbar width in pixels
  margin: number          // Margin from box edge in pixels
  trackColor: string      // CSS color for scrollbar track
  thumbColor: string      // CSS color for scrollbar thumb
  minThumbHeight: number  // Minimum thumb height in pixels
}
```

**Default Configuration:**
```typescript
const defaultScrollbarConfig: ScrollbarConfig = {
  width: 12,
  margin: 2,
  trackColor: 'rgba(0, 0, 0, 0.1)',
  thumbColor: 'rgba(0, 0, 0, 0.3)',
  minThumbHeight: 30
}
```

**Usage:**
```typescript
import { defaultScrollbarConfig, type ScrollbarConfig } from './renderers/ScrollbarConfig'

// Use defaults
const renderer = new ScrollbarRenderer(context)

// Custom configuration
const customConfig: ScrollbarConfig = {
  ...defaultScrollbarConfig,
  thumbColor: 'rgba(100, 100, 255, 0.5)',
  width: 16
}
const customRenderer = new ScrollbarRenderer(context, customConfig)
```

## Architecture

The scrollbar rendering system uses a clean separation of concerns:

- **ScrollbarRenderer**: Handles all rendering logic
- **ScrollbarConfig**: Provides configuration interface and defaults
- **CanvasRenderer**: Integrates scrollbar renderer for overflow containers

This design allows for:
- Easy customization of scrollbar appearance
- Testing renderer in isolation
- Potential future renderers (e.g., grid lines, guides, etc.)

## Integration with CanvasRenderer

The `CanvasRenderer` class uses `ScrollbarRenderer` internally:

```typescript
class CanvasRenderer {
  private scrollbarRenderer: ScrollbarRenderer

  constructor(params: CanvasRendererParameters) {
    this.scrollbarRenderer = new ScrollbarRenderer(this.drawContext)
  }

  // Scrollbars are rendered automatically for overflow containers
}
```

## Visual Design

The scrollbars use a pill shape (fully rounded corners) for a modern, minimal aesthetic:

```
┌────────────────┐
│                │  ← Track (light gray)
│   ┌────────┐   │
│   │        │   │  ← Thumb (darker gray)
│   │        │   │
│   └────────┘   │
│                │
└────────────────┘
```

The thumb size is proportional to the visible content ratio:
- More visible content = larger thumb
- Less visible content = smaller thumb (minimum 30px)

## Related Files

- `../CanvasRenderer.ts` - Main renderer that uses ScrollbarRenderer
- `../../jsx/utils/ScrollManager.ts` - Handles scroll interactions
- `../../jsx/box/Box.implementation.tsx` - Box component with overflow support
