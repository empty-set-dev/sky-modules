# Layout Engine

Universal layout computation engine for platform-agnostic rendering (Canvas, Three.js, DOM, etc.).

## Installation

```bash
npm install @sky-modules/design
```

## Features

- Platform-agnostic layout computation
- Flexbox and Block layout support
- CSS-like box model (margin, padding, border)
- Flex-grow, flex-shrink, flex-basis support
- Automatic size calculation
- Nested layout computation
- Zero dependencies

## Usage

### Basic Layout

```typescript
import { computeLayout, type LayoutBox } from '@sky-modules/design'

const layout: LayoutBox = {
    styles: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        padding: 20
    },
    children: [
        {
            styles: { width: 100, height: 50 }
        },
        {
            styles: { width: 150, height: 50 }
        }
    ]
}

const result = computeLayout(layout)
// result.children[0].position = [20, 20]
// result.children[1].position = [130, 20]
```

### Flex Layout with flex-grow

```typescript
const flexLayout: LayoutBox = {
    styles: {
        display: 'flex',
        width: 500,
        height: 100,
        flexDirection: 'row'
    },
    children: [
        {
            styles: {
                flexGrow: 1,
                flexBasis: 100
            }
        },
        {
            styles: {
                flexGrow: 2,
                flexBasis: 100
            }
        }
    ]
}

const result = computeLayout(flexLayout)
// First child gets 1/3 of remaining space
// Second child gets 2/3 of remaining space
```

## API

### computeLayout(parent, parentSize?)

Compute layout for a box and its children.

**Parameters:**
- `parent: LayoutBox` - Root layout box
- `parentSize?: { width?: number; height?: number }` - Optional parent constraints

**Returns:** `LayoutBox` - Layout box with computed positions and sizes

### LayoutBox

```typescript
interface LayoutBox {
    id?: string
    styles: LayoutStyles
    children?: LayoutBox[]
    position?: [number, number]  // Computed x, y
    size?: [number, number]      // Computed width, height
}
```

### LayoutStyles

```typescript
interface LayoutStyles {
    // Display
    display?: 'block' | 'flex' | 'inline' | 'inline-block' | 'grid' | 'none'

    // Size
    width?: string | number
    height?: string | number

    // Padding
    padding?: string | number
    paddingTop?: string | number
    paddingRight?: string | number
    paddingBottom?: string | number
    paddingLeft?: string | number

    // Margin
    margin?: string | number
    marginTop?: string | number
    marginRight?: string | number
    marginBottom?: string | number
    marginLeft?: string | number

    // Flexbox
    flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
    gap?: string | number
    rowGap?: string | number
    columnGap?: string | number

    // Flex item
    flexGrow?: number
    flexShrink?: number
    flexBasis?: string | number
}
```

## Use Cases

### Canvas Rendering

```typescript
import { computeLayout } from '@sky-modules/design'

const layout = computeLayout({
    styles: { display: 'flex', width: 800, height: 600 },
    children: [/* ... */]
})

// Render to canvas
layout.children?.forEach(child => {
    const [x, y] = child.position!
    const [w, h] = child.size!
    ctx.fillRect(x, y, w, h)
})
```

### Three.js UI

```typescript
import { computeLayout } from '@sky-modules/design'
import * as THREE from 'three'

const layout = computeLayout({
    styles: { display: 'flex', width: 1000, height: 800 },
    children: [/* ... */]
})

layout.children?.forEach(child => {
    const [x, y] = child.position!
    const [w, h] = child.size!

    const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        material
    )
    mesh.position.set(x, y, 0)
    scene.add(mesh)
})
```

### DOM Positioning

```typescript
const layout = computeLayout({
    styles: { display: 'flex', width: window.innerWidth },
    children: [/* ... */]
})

layout.children?.forEach((child, i) => {
    const element = elements[i]
    const [x, y] = child.position!
    const [w, h] = child.size!

    element.style.transform = `translate(${x}px, ${y}px)`
    element.style.width = `${w}px`
    element.style.height = `${h}px`
})
```

## Files

### Layout.Engine.ts

**Purpose:** Platform-agnostic layout computation engine

**Key exports:**
- `computeLayout(parent, parentSize?)` - Main layout computation function
- `LayoutBox` - Layout box interface with styles, children, position, size
- `LayoutStyles` - CSS-like layout styles interface

**Features:**
- CSS box model (margin, padding, border)
- Flexbox layout (flex-direction, justify-content, align-items, gap)
- Flex item properties (flex-grow, flex-shrink, flex-basis)
- Block layout (vertical stacking)
- Automatic size calculation
- Recursive layout computation
- Unit parsing (px, em, rem, %)
- Spacing shorthand (padding, margin)

**Internal functions:**
- `parseUnit()` - Parse CSS units to pixels
- `parseSpacing()` - Parse spacing shorthand (1-4 values)
- `getSpacingValue()` - Get individual margin/padding value
- `computeContentSize()` - Compute size based on content
- `computeBlockLayout()` - Compute block layout (vertical)
- `computeFlexLayout()` - Compute flexbox layout with flex-grow/shrink

## Best Practices

1. **Use explicit sizes when possible** - Makes layout more predictable
2. **Leverage flex-grow for responsive layouts** - Automatically fills available space
3. **Test with different parent sizes** - Ensure layout adapts correctly
4. **Use gap instead of margins** - Simpler spacing between flex items
5. **Nest layouts for complex UIs** - Build hierarchical layout trees

## Related

- **Box** - Component that can use layout computation
- **Brand** - Design tokens for spacing, sizing
- **Canvas** - Canvas rendering with layout
