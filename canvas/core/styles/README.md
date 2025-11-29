# Canvas Core Styles

Style management module for Canvas core. This module was extracted from `CanvasRenderer.ts` to provide a clean, fluent API for canvas styling operations.

## Modules

### StyleManager

**File:** `StyleManager.ts`

Manages all canvas styling operations with a fluent API and automatic pixel ratio scaling.

**Features:**
- Fluent API for method chaining
- Automatic pixel ratio scaling for high-DPI displays
- Comprehensive style coverage (fill, stroke, line, shadow, global)
- Builder patterns for common style combinations
- Type-safe canvas styling

**Usage:**

#### Basic Styling
```typescript
import { StyleManager } from './styles/StyleManager'

const styleManager = new StyleManager(context, pixelRatio)

// Simple fill and stroke
styleManager
  .setFillStyle('#ff0000')
  .setStrokeStyle('#0000ff')
  .setLineWidth(2)
```

#### Line Styles
```typescript
// Individual settings
styleManager
  .setLineWidth(3)
  .setLineCap('round')
  .setLineJoin('miter')
  .setMiterLimit(10)

// Builder pattern for common line configurations
styleManager.withLineStyle(3, 'round', 'bevel')
```

#### Dashed Lines
```typescript
// Set dash pattern (automatically scaled)
styleManager
  .setLineDash([10, 5, 2, 5])
  .setLineDashOffset(0)
```

#### Shadow Effects
```typescript
// Individual settings
styleManager
  .setShadowBlur(10)
  .setShadowColor('rgba(0, 0, 0, 0.5)')
  .setShadowOffsetX(5)
  .setShadowOffsetY(5)

// Builder pattern for shadows
styleManager.withShadow(10, 'rgba(0, 0, 0, 0.5)', 5, 5)

// Clear shadow
styleManager.clearShadow()
```

#### Global Styles
```typescript
// Alpha and composite operations
styleManager
  .setGlobalAlpha(0.5)
  .setGlobalCompositeOperation('multiply')
```

**API Reference:**

##### Fill and Stroke
- `setFillStyle(style: string | CanvasGradient | CanvasPattern): this`
- `setStrokeStyle(style: string | CanvasGradient | CanvasPattern): this`

##### Line Styles
- `setLineWidth(value: number): this` - Auto-scaled by pixelRatio
- `setLineCap(value: CanvasLineCap): this` - 'butt' | 'round' | 'square'
- `setLineJoin(value: CanvasLineJoin): this` - 'bevel' | 'round' | 'miter'
- `setMiterLimit(value: number): this`
- `setLineDash(segments: number[]): this` - Auto-scaled by pixelRatio
- `setLineDashOffset(value: number): this` - Auto-scaled by pixelRatio

##### Shadow Styles
- `setShadowBlur(value: number): this` - Auto-scaled by pixelRatio
- `setShadowColor(value: string): this`
- `setShadowOffsetX(value: number): this` - Auto-scaled by pixelRatio
- `setShadowOffsetY(value: number): this` - Auto-scaled by pixelRatio

##### Global Styles
- `setGlobalAlpha(value: number): this`
- `setGlobalCompositeOperation(value: GlobalCompositeOperation): this`

##### Builder Patterns
- `withLineStyle(width: number, cap?: CanvasLineCap, join?: CanvasLineJoin): this`
- `withShadow(blur: number, color: string, offsetX?: number, offsetY?: number): this`
- `clearShadow(): this`

## Architecture

The StyleManager uses several design patterns:

### Fluent Interface Pattern
All methods return `this` to enable method chaining:
```typescript
styleManager
  .setFillStyle('#ff0000')
  .setLineWidth(2)
  .withShadow(5, 'rgba(0,0,0,0.3)')
```

### Builder Pattern
Complex style configurations are simplified:
```typescript
// Instead of:
styleManager.setLineWidth(2)
styleManager.setLineCap('round')
styleManager.setLineJoin('round')

// Use:
styleManager.withLineStyle(2, 'round', 'round')
```

### Automatic Scaling
All dimension-related values are automatically scaled by `pixelRatio`:
```typescript
// User provides logical pixels
styleManager.setLineWidth(2)

// Internally becomes (for 2x displays):
context.lineWidth = 2 * pixelRatio  // 4 actual pixels
```

This ensures crisp rendering on high-DPI displays without manual scaling.

## Integration with CanvasRenderer

The `CanvasRenderer` class uses `StyleManager` internally:

```typescript
class CanvasRenderer {
  private styleManager: StyleManager

  constructor(params: CanvasRendererParameters) {
    this.styleManager = new StyleManager(this.drawContext, this.pixelRatio)
  }

  // Delegates style methods to StyleManager
  setFillStyle(style: string | CanvasGradient | CanvasPattern): this {
    this.styleManager.setFillStyle(style)
    return this
  }
}
```

## Benefits of Extraction

Extracting StyleManager from CanvasRenderer provides:

1. **Separation of Concerns** - Styling logic is isolated
2. **Testability** - Can test styling independently
3. **Reusability** - Can be used in other canvas contexts
4. **Maintainability** - Easier to understand and modify
5. **Type Safety** - Clear type definitions for all style operations

## Related Files

- `../CanvasRenderer.ts` - Main renderer that uses StyleManager
- `../../materials/` - Material classes that use canvas styles
- `../../rendering/renderCSSToCanvas.ts` - CSS-to-canvas style conversion
