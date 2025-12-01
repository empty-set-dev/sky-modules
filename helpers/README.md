# helpers

General helper utilities for class names, loops, assets management, and internationalization.

## Installation

```bash
npm install @sky-modules/helpers
```

## Features

- **cn** - Conditional class name builder with CSS modules support
- **Loop** - Asynchronous interval loop with effect-based lifecycle
- **Sky.AssetsManager** - Three.js texture loading and management
- **renderLocaleTemplateString** - React component interpolation for i18n templates

## Usage

### Class Name Builder (cn)

Build conditional class names with optional CSS modules mapping:

```typescript
import cn from '@sky-modules/helpers/cn'

// Basic usage
const cx = cn()
const className = cx('btn', isActive && 'active', { disabled: isDisabled })
// Result: "btn active" (if isActive=true, isDisabled=false)

// Template literal syntax
const className = cx`
  base-class
  ${isActive && 'active'}
  ${variant === 'primary' ? 'btn-primary' : 'btn-secondary'}
`

// With CSS modules
import styles from './Button.module.css'
const cx = cn(styles)
const className = cx('@button', isActive && '@active')
// '@' prefix resolves to styles.button and styles.active
```

**Features:**
- Like clsx but with template literal support
- CSS modules integration via @ prefix
- Automatic whitespace normalization
- Type-safe with TypeScript

### Asynchronous Loop

Create repeating operations with automatic cleanup:

```typescript
import Loop from '@sky-modules/helpers/Loop'
import { Effect, EffectTree } from '@sky-modules/features/effect'

const root = new EffectTree()
const effect = new Effect(root)

// Run every 100ms
new Loop((100).milliseconds, (dt) => {
  console.log(`Loop tick, delta: ${dt.inMilliseconds}ms`)
  performTask()
}, effect)

// Loop automatically stops when effect is disposed
effect.dispose()
```

**Use cases:**
- Game update loops
- Server-side polling
- Periodic data synchronization
- Animation sequencing

### Assets Manager

Load and manage Three.js textures:

```typescript
import { Sky } from '@sky-modules/helpers'

const assets = new Sky.AssetsManager()

// Load textures
await assets.loadTexture('logo')
await assets.loadTexture('floor', { wrapX: true, wrapY: true, factor: 2 })

// Use textures
const texture = assets.getTexture('logo')
material.map = texture

// Monitor progress
console.log(`Loading: ${(assets.progress * 100).toFixed(0)}%`)
```

**Features:**
- Automatic progress tracking
- Texture wrapping configuration
- Scaling factors
- Error handling
- Caching

### Locale Template String

Render i18n strings with React component interpolation:

```typescript
import renderLocaleTemplateString from '@sky-modules/helpers/renderLocaleTemplateString'

const Bold: FC<PropsWithChildren> = ({ children }) => <strong>{children}</strong>
const Link: FC<PropsWithChildren> = ({ children }) => <a href="#">{children}</a>

const template = "Click <[link]>here</> to learn <[bold]>more</>"

const result = renderLocaleTemplateString(template, {
  link: Link,
  bold: Bold
})
// Renders: Click <a href="#">here</a> to learn <strong>more</strong>
```

## API

### cn(styles?)

Creates a class name builder function.

**Parameters:**
- `styles?: Record<string, string>` - Optional CSS modules mapping

**Returns:** `Cx` - Class name builder function

**Exports:**
- `cn(styles)` - Function to create builder
- `cx` - Default builder instance (no CSS modules)

### Loop

**Constructor:** `Loop(interval: Time, callback: (dt: Time) => void, dep: EffectDep)`

**Parameters:**
- `interval` - Time between iterations
- `callback` - Function called each iteration with delta time
- `dep` - Effect dependency for lifecycle management

**Properties:**
- `effect: Effect` - Effect managing the loop
- `looping?: Async` - Promise representing the running loop

### Sky.AssetsManager

**Constructor:** `new Sky.AssetsManager()`

**Methods:**
- `loadTexture(name, params?): Promise<Texture | void>` - Loads texture from /images/{name}.png
- `getTexture(name): Texture` - Retrieves loaded texture
- `getTextureParameters(name): TextureParameters` - Gets texture metadata

**Properties:**
- `textureLoader: TextureLoader` - Three.js loader instance
- `progress: number` - Loading progress (0 to 1)

**Interfaces:**
- `TextureParameters` - Texture metadata (texture, factor, wrapX, wrapY)
- `LoadTextureParameters` - Loading options (factor, wrapX, wrapY)

### renderLocaleTemplateString

**Function:** `renderLocaleTemplateString(string: string, args: Record<string, FC>): ReactNode`

**Parameters:**
- `string` - Template with `<[key]>content</>` placeholders
- `args` - Mapping of keys to React components

**Returns:** Array of React nodes

## Files

### cn/cn.ts

**Purpose:** Conditional class name builder

**Key exports:**
- `cn(styles?)` - Creates class name builder
- `cx` - Default builder instance
- `Cx` - Builder function type

### Loop/Loop.ts

**Purpose:** Asynchronous interval loop

**Key exports:**
- `Loop` - Loop class with effect-based lifecycle

### Sky.AssetsManager.ts

**Purpose:** Three.js texture management

**Key exports:**
- `Sky.AssetsManager` - Asset manager class
- `Sky.AssetsManager.TextureParameters` - Texture metadata interface
- `Sky.AssetsManager.LoadTextureParameters` - Loading options interface

### renderLocaleTemplateString.tsx

**Purpose:** i18n template rendering with React components

**Key exports:**
- `renderLocaleTemplateString()` - Template rendering function

### getStore.ts

**Purpose:** Store access helper (commented out, not currently in use)

## Related Modules

- [@sky-modules/features/effect](../features/effect/) - Effect system for Loop lifecycle
- [@sky-modules/utilities/Time](../utilities/Time/) - Time types for Loop intervals
- [@sky-modules/utilities/Timer](../utilities/Timer/) - Timer utilities used by Loop
- [@sky-modules/core/type-guards](../core/type-guards/) - Type guards for cn()

## Implementation Notes

### cn() Implementation

- Uses clsx for core class name logic
- Template literal support via `isTemplateStringsArray()` type guard
- CSS modules resolved with @ prefix lookup
- Whitespace normalized with regex
- Throws error if CSS module class not found

### Loop Implementation

- Built on top of Effect system for automatic cleanup
- Uses WaitTimer for precise interval timing
- Compensates for execution time delays
- Async/await pattern for loop control
- Stops immediately when parent effect disposes

### AssetsManager Implementation

- Tracks loading progress across multiple textures
- Uses Three.TextureLoader internally
- Stores textures in private map by name
- Progress calculated as average of all loaders
- Errors logged to console, doesn't throw

### renderLocaleTemplateString Implementation

- Parses template with regex matching
- Sorts placeholders by position in string
- Renders components with dangerouslySetInnerHTML for HTML content
- Creates React keys automatically
- Handles nested components

## Best Practices

### Using cn()

1. **Create once** - Instantiate builder once per component/module
2. **CSS modules** - Use @ prefix for type-safe class references
3. **Template literals** - Use for complex conditional logic
4. **Combine with clsx** - Already included, no need to import separately

### Using Loop

1. **Effect dependency** - Always pass an effect for proper cleanup
2. **Async callbacks** - Callbacks can be async, loop awaits completion
3. **Delta time** - Use provided delta for frame-rate independent logic
4. **Cancellation** - Loop stops when parent effect disposes

### Using AssetsManager

1. **Preload** - Load all textures before rendering
2. **Progress tracking** - Monitor progress property for loading screens
3. **Error handling** - Check console for load failures
4. **Wrapping** - Configure wrapping for tiled textures

### Using renderLocaleTemplateString

1. **HTML safety** - Be careful with dangerouslySetInnerHTML
2. **Component keys** - Uses placeholder keys for React reconciliation
3. **Sorting** - Components rendered in order of appearance
4. **Nested placeholders** - Not supported, flatten structure

## Examples

### Styled Button with cn()

```typescript
import cn from '@sky-modules/helpers/cn'
import styles from './Button.module.css'

const cx = cn(styles)

interface ButtonProps {
  variant: 'primary' | 'secondary'
  size: 'sm' | 'md' | 'lg'
  disabled?: boolean
  active?: boolean
}

function Button({ variant, size, disabled, active }: ButtonProps) {
  const className = cx(
    '@button',
    `@${variant}`,
    `@${size}`,
    active && '@active',
    { '@disabled': disabled }
  )

  return <button className={className}>Click me</button>
}
```

### Game Update Loop

```typescript
import Loop from '@sky-modules/helpers/Loop'

class GameController {
  readonly effect: Effect
  private entities: Entity[] = []

  constructor(dep: EffectDep) {
    this.effect = new Effect(dep, this)

    // Update 60 times per second
    new Loop((1/60).seconds, (dt) => {
      this.updatePhysics(dt)
      this.updateEntities(dt)
      this.checkCollisions()
    }, this.effect)
  }

  updatePhysics(dt: Time) {
    this.entities.forEach(e => e.physics.update(dt.inSeconds))
  }

  updateEntities(dt: Time) {
    this.entities.forEach(e => e.update(dt))
  }

  checkCollisions() {
    // Collision detection logic
  }
}
```

### Texture Loading Screen

```typescript
import { Sky } from '@sky-modules/helpers'

async function loadGameAssets() {
  const assets = new Sky.AssetsManager()

  const textures = [
    'player',
    'enemy',
    'background',
    'tiles'
  ]

  // Start loading
  const promises = textures.map(name =>
    assets.loadTexture(name, { wrapX: true, wrapY: true })
  )

  // Monitor progress
  const interval = setInterval(() => {
    updateLoadingBar(assets.progress)

    if (assets.progress === 1) {
      clearInterval(interval)
      startGame()
    }
  }, 100)

  await Promise.all(promises)
}
```

### Internationalized Text with Links

```typescript
import renderLocaleTemplateString from '@sky-modules/helpers/renderLocaleTemplateString'

const Strong: FC<PropsWithChildren> = ({ children }) => (
  <strong className="highlight">{children}</strong>
)

const ExternalLink: FC<PropsWithChildren> = ({ children }) => (
  <a href="https://example.com" target="_blank" rel="noopener">
    {children}
  </a>
)

function WelcomeMessage({ t }: { t: (key: string) => string }) {
  const template = t('welcome.message')
  // template = "Welcome! <[strong]>New users</> can <[link]>read the guide</>"

  const rendered = renderLocaleTemplateString(template, {
    strong: Strong,
    link: ExternalLink
  })

  return <div className="welcome">{rendered}</div>
}
```
