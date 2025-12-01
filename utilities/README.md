# utilities

Utility functions for time management, performance measurement, 3D coordinate transformations, and environment variables.

## Installation

```bash
npm install @sky-modules/utilities
```

## Features

- **Timer** - Time tracking with delta time, intervals, timeouts, and precise waiting
- **milliseconds** - Time unit constants (second, minute, hour, day, week in ms)
- **measurePerformance** - Benchmark and compare code performance
- **getCameraMouseProjection** - 3D mouse picking for Three.js cameras
- **getEnvVariable** - Type-safe environment variable access
- **transformWindowCoordinates** - Convert window coordinates to NDC for WebGL

## Usage

### Timer Classes

Multiple timer variants for different use cases:

```typescript
import Timer, { TimeoutTimer, IntervalTimer, WaitTimer } from '@sky-modules/utilities/Timer'

// Basic timer - measure elapsed time
const timer = new Timer('My Operation')
// ... do work ...
timer.log() // Logs: "My Operation: 1.23s"

// Get delta time programmatically
const dt = timer.deltaTime()
console.log(`Elapsed: ${dt.inSeconds}s`)

// Timeout timer - check if time elapsed
const timeout = new TimeoutTimer()
if (timeout.timeout((5).seconds)) {
  console.log('5 seconds passed!')
}

// Interval timer - fire at regular intervals
const interval = new IntervalTimer()
if (interval.interval((100).milliseconds)) {
  console.log('100ms interval fired!')
}

// Wait timer - precise async delays with compensation
const wait = new WaitTimer()
await wait.wait((1).second)
```

**Timer control:**

```typescript
// Enable/disable timers by label
Timer.off('Performance')  // Disable all 'Performance' timers
Timer.on('Performance')   // Re-enable

// Hierarchical labels
const timer = new Timer('App: Network: Fetch')
timer.log('users')  // Logs: "App: Network: Fetch: users: 0.15s"

// Only logs if all parent labels enabled
Timer.off('App: Network')
timer.log('users')  // No output (Network disabled)
```

### Time Constants

```typescript
import { secondMs, minuteMs, hourMs, dayMs, weekMs } from '@sky-modules/utilities/times/milliseconds'

console.log(secondMs)  // 1000
console.log(minuteMs)  // 60000
console.log(hourMs)    // 3600000
console.log(dayMs)     // 86400000
console.log(weekMs)    // 604800000

// Use with Time extension methods
const delay = (5 * secondMs).milliseconds
const timeout = (2 * minuteMs).milliseconds
```

### Performance Measurement

Compare multiple code variations:

```typescript
import measurePerformance from '@sky-modules/utilities/measurePerformance'

const data = Array.from({ length: 1000 }, (_, i) => i)

measurePerformance(1000, 5, [
  ['Array.push', () => {
    const arr: number[] = []
    data.forEach(x => arr.push(x))
  }],
  ['Spread operator', () => {
    const arr = [...data]
  }],
  ['Array.from', () => {
    const arr = Array.from(data)
  }]
])
// Output:
// Cycle 1
// Array.push: 45ms
// Spread operator: 12ms
// Array.from: 15ms
// ...
// Final averages:
// Array.push: 43ms
// Spread operator: 11ms
// Array.from: 14ms
```

### 3D Mouse Picking

Project mouse coordinates to 3D world space:

```typescript
import getCameraMouseProjection from '@sky-modules/utilities/getCameraMouseProjection'
import transformWindowCoordinates from '@sky-modules/utilities/transformWindowCoordinates'
import Vector2 from '@sky-modules/math/Vector2'

window.addEventListener('click', (e) => {
  // Convert window coordinates to NDC
  const mouse = new Vector2(e.clientX, e.clientY)
  const ndc = transformWindowCoordinates(mouse)

  // Project to 3D world (z=0 plane)
  const worldPos = getCameraMouseProjection(camera, ndc)

  console.log(`Clicked at: ${worldPos.x}, ${worldPos.y}, ${worldPos.z}`)

  // Place object at click position
  object.position.copy(worldPos)
})
```

### Coordinate Transformation

Convert screen to NDC coordinates:

```typescript
import transformWindowCoordinates from '@sky-modules/utilities/transformWindowCoordinates'
import Vector2 from '@sky-modules/math/Vector2'

window.addEventListener('mousemove', (e) => {
  const windowCoords = new Vector2(e.clientX, e.clientY)
  const ndc = transformWindowCoordinates(windowCoords)

  console.log(`NDC: (${ndc.x}, ${ndc.y})`)
  // Center of screen: (0, 0)
  // Top-left: (-1, 1)
  // Bottom-right: (1, -1)
})
```

### Environment Variables

Type-safe environment variable access:

```typescript
import getEnvVariable from '@sky-modules/utilities/getEnvVariable'

try {
  const apiKey = getEnvVariable('API_KEY')
  const databaseUrl = getEnvVariable('DATABASE_URL')
  const port = parseInt(getEnvVariable('PORT'))

  console.log(`Connecting to: ${databaseUrl}`)
  initializeServer(port)
} catch (error) {
  console.error('Missing required environment variable')
  process.exit(1)
}
```

## API

### Timer

**Base class:** `TimerBase`

**Static methods:**
- `Timer.on(label)` - Enable timer by label
- `Timer.off(label)` - Disable timer by label

**Constructor:** `new Timer(label?)`

**Methods:**
- `reset(): this` - Reset timer to current time
- `deltaTime(): Time` - Get and update elapsed time
- `log(label?)` - Log elapsed time with optional sub-label
- `trace(label?)` - Trace elapsed time with stack trace
- `isOn(label?): boolean` - Check if timer is enabled

### TimeoutTimer

Extends Timer with timeout checking.

**Methods:**
- `timeout(time: Time): boolean` - Returns true if timeout elapsed

### IntervalTimer

Extends Timer with interval firing.

**Methods:**
- `interval(time: Time, params?): boolean` - Returns true when interval fires
- `reset(): this` - Resets timer and interval state

**Parameters:**
- `skipFirstTime?: boolean` - Don't fire on first call

### WaitTimer

Extends Timer with precise async waiting.

**Constructor:** `new WaitTimer(label?, previousTimer?)`

**Methods:**
- `wait(time: Time): Promise<void>` - Wait with execution time compensation

### measurePerformance

**Function:** `measurePerformance(times, cycles, variations)`

**Parameters:**
- `times: number` - Iterations per cycle
- `cycles: number` - Number of cycles
- `variations: [name, callback][]` - Code to benchmark

### getCameraMouseProjection

**Function:** `getCameraMouseProjection(camera, mouse): Vector3`

**Parameters:**
- `camera: Three.Camera` - Three.js camera
- `mouse: Vector2` - Normalized mouse coordinates (from transformWindowCoordinates)

**Returns:** 3D position on z=0 plane

### transformWindowCoordinates

**Function:** `transformWindowCoordinates(mouse): Vector2`

**Parameters:**
- `mouse: Vector2` - Window pixel coordinates

**Returns:** Normalized device coordinates (-1 to 1)

### getEnvVariable

**Function:** `getEnvVariable(name): string`

**Parameters:**
- `name: string` - Environment variable name

**Returns:** Variable value

**Throws:** Error if variable not defined

## Files

### Timer/Timer.ts

**Purpose:** Time measurement and tracking

**Key exports:**
- `Timer` - Basic timer class
- `TimerBase` - Base class for all timers
- `TimeoutTimer` - Timeout checking
- `IntervalTimer` - Interval firing
- `WaitTimer` - Precise async waiting

### times/milliseconds/milliseconds.ts

**Purpose:** Time unit constants

**Key exports:**
- `secondMs` - 1000ms
- `minuteMs` - 60000ms
- `hourMs` - 3600000ms
- `dayMs` - 86400000ms
- `weekMs` - 604800000ms

### measurePerformance.ts

**Purpose:** Performance benchmarking

**Key exports:**
- `measurePerformance()` - Benchmark function

### getCameraMouseProjection.ts

**Purpose:** 3D mouse picking

**Key exports:**
- `getCameraMouseProjection()` - Ray-plane intersection

### transformWindowCoordinates.ts

**Purpose:** Coordinate system conversion

**Key exports:**
- `transformWindowCoordinates()` - Window to NDC

### getEnvVariable.ts

**Purpose:** Environment variable access

**Key exports:**
- `getEnvVariable()` - Safe env var getter

## Related Modules

- [@sky-modules/math/Vector2](../math/Vector2/) - 2D vectors for coordinates
- [@sky-modules/math/Vector3](../math/Vector3/) - 3D vectors for projections
- [@sky-modules/core/Console](../core/Console/) - Colored console output
- [@sky-modules/core/idle](../core/idle/) - Async delay utilities

## Implementation Notes

### Timer Implementation

- Uses `Date.now()` for time tracking
- Hierarchical label system with colon separators
- Static enable/disable controls
- Delta time automatically advances internal timer
- Labels optional but recommended for debugging

### WaitTimer Compensation

- Tracks extra execution time beyond expected interval
- Compensates by reducing next wait duration
- Prevents drift in long-running loops
- Capped at interval duration to avoid negative waits

### measurePerformance Output

- Runs each variation sequentially
- Logs individual cycle times
- Calculates and logs averages
- Uses `Date.now()` for millisecond precision
- Output via Console.log for colored formatting

### Coordinate Systems

**Window coordinates:**
- Origin: top-left corner
- X: 0 to window.innerWidth
- Y: 0 to window.innerHeight

**NDC (Normalized Device Coordinates):**
- Origin: center
- X: -1 (left) to 1 (right)
- Y: -1 (bottom) to 1 (top)

**3D World:**
- Determined by camera projection
- getCameraMouseProjection finds z=0 plane intersection

### Environment Variables

- Reads from `process.env`
- Throws on missing variables (fail-fast)
- No default values (explicit is better)
- Type is always string (parse as needed)

## Best Practices

### Using Timers

1. **Label everything** - Makes debugging easier
2. **Use hierarchical labels** - Enable/disable by category
3. **Choose right timer** - Timeout, Interval, or Wait
4. **Disable in production** - Use Timer.off() for performance-critical code
5. **Log sparingly** - Too many logs slow down execution

### Performance Measurement

1. **Warm up** - Run once before measuring to warm up JIT
2. **Multiple cycles** - Average over many cycles for accuracy
3. **Realistic data** - Use production-like data sizes
4. **Isolate code** - Minimize setup/teardown in callbacks
5. **Compare alternatives** - Test multiple approaches

### 3D Picking

1. **Transform first** - Always use transformWindowCoordinates before projection
2. **Check camera type** - Works with perspective and orthographic
3. **Z-plane assumption** - getCameraMouseProjection assumes z=0
4. **Raycasting** - For complex meshes, use Three.js Raycaster instead
5. **Performance** - Cache calculations for mousemove events

### Environment Variables

1. **Validate early** - Call getEnvVariable at startup
2. **Type conversion** - Parse numbers/booleans as needed
3. **Error handling** - Catch and handle missing vars gracefully
4. **Defaults** - Use || operator for optional vars
5. **Security** - Never log sensitive env vars

## Examples

### FPS Counter

```typescript
import { IntervalTimer } from '@sky-modules/utilities/Timer'

class FPSCounter {
  private frames = 0
  private fpsTimer = new IntervalTimer('FPS')

  update() {
    this.frames++

    if (this.fpsTimer.interval((1).second)) {
      console.log(`FPS: ${this.frames}`)
      this.frames = 0
    }
  }
}
```

### Precise Game Loop

```typescript
import { WaitTimer } from '@sky-modules/utilities/Timer'

class GameLoop {
  private timer = new WaitTimer('GameLoop')

  async run() {
    const targetFPS = 60
    const frameTime = (1000 / targetFPS).milliseconds

    while (true) {
      this.update()
      this.render()

      await this.timer.wait(frameTime)
      // Automatically compensates for update/render time
    }
  }
}
```

### Interactive 3D Scene

```typescript
import getCameraMouseProjection from '@sky-modules/utilities/getCameraMouseProjection'
import transformWindowCoordinates from '@sky-modules/utilities/transformWindowCoordinates'

class InteractiveScene {
  private camera: Three.Camera
  private cursor: Three.Mesh

  constructor(camera: Three.Camera) {
    this.camera = camera

    window.addEventListener('mousemove', (e) => {
      const mouse = new Vector2(e.clientX, e.clientY)
      const ndc = transformWindowCoordinates(mouse)
      const worldPos = getCameraMouseProjection(this.camera, ndc)

      // Update cursor position
      this.cursor.position.copy(worldPos)
    })

    window.addEventListener('click', (e) => {
      const mouse = new Vector2(e.clientX, e.clientY)
      const ndc = transformWindowCoordinates(mouse)
      const worldPos = getCameraMouseProjection(this.camera, ndc)

      // Spawn object at click position
      this.spawnObject(worldPos)
    })
  }

  spawnObject(position: Vector3) {
    const obj = new Three.Mesh(geometry, material)
    obj.position.copy(position)
    this.scene.add(obj)
  }
}
```

### Configuration Loader

```typescript
import getEnvVariable from '@sky-modules/utilities/getEnvVariable'

interface AppConfig {
  port: number
  host: string
  databaseUrl: string
  apiKey: string
  environment: 'development' | 'production'
  debug: boolean
}

function loadConfig(): AppConfig {
  return {
    port: parseInt(getEnvVariable('PORT')),
    host: getEnvVariable('HOST'),
    databaseUrl: getEnvVariable('DATABASE_URL'),
    apiKey: getEnvVariable('API_KEY'),
    environment: getEnvVariable('NODE_ENV') as AppConfig['environment'],
    debug: getEnvVariable('DEBUG') === 'true'
  }
}

// Usage
try {
  const config = loadConfig()
  console.log(`Starting server on ${config.host}:${config.port}`)
  startServer(config)
} catch (error) {
  console.error('Configuration error:', error.message)
  console.error('Please check your .env file')
  process.exit(1)
}
```
