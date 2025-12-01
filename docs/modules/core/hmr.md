# HMR

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  hmr utility module
</div>

Hot Module Replacement detection utilities.

## Installation

```typescript
import isHot from '@sky-modules/core/hmr'
```

## API

### isHot()

Check if code is running in Hot Module Replacement (HMR) context.

```typescript
isHot(): boolean
```

**Returns:** boolean - True if running in HMR context, false otherwise

**Current Status:** Always returns `false` (implementation pending)

## Usage

### Detecting HMR Environment

```typescript
import isHot from '@sky-modules/core/hmr'

if (isHot()) {
  console.log('Running in HMR mode')
} else {
  console.log('Running in normal mode')
}
```

### Conditional Initialization

```typescript
import isHot from '@sky-modules/core/hmr'

function initializeApp() {
  if (isHot()) {
    // Setup HMR-specific handlers
    setupHMRListeners()
  } else {
    // Normal initialization
    setupNormalListeners()
  }
}
```

### Module-Specific Logic

```typescript
if (isHot()) {
  // Store state for hot reload
  window.__appState = saveState()
} else {
  // Normal cleanup
  cleanupResources()
}
```

## Notes

- Implementation is planned for future versions
- Currently always returns false
- Used to enable HMR-aware code paths in development
- Helps prevent unnecessary re-initialization during hot reloads
