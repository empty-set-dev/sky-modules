# @sky-modules/web

Web platform utilities for browser-specific functionality.

## Installation

```bash
npm install @sky-modules/web
```

## Features

- HTML tag constants for validation
- iOS device detection (including iPadOS)
- Touch device detection via media queries

## Usage

### HTML Tags

Complete list of standard HTML5 tags:

```ts
import HTML_TAGS from '@sky-modules/web/HTML_TAGS'

const isValidTag = (tag: string) => HTML_TAGS.includes(tag)
console.log(isValidTag('div')) // true
console.log(isValidTag('custom')) // false

// Iterate all tags
HTML_TAGS.forEach(tag => console.log(tag))
```

**Global usage:**

```ts
import '@sky-modules/web/global'

HTML_TAGS.forEach(tag => console.log(tag))
```

### iOS Detection

Detect iOS devices including iPadOS:

```ts
import isIos, { getIosVersion } from '@sky-modules/web/helpers/isIos'

if (isIos()) {
  // iOS-specific behavior
  enableIOSScrollFix()
}

const version = getIosVersion()
if (version && version >= 15) {
  // iOS 15+ features
}
```

**Global usage:**

```ts
import '@sky-modules/web/helpers/global'

if (isIos()) {
  // Available globally
}
```

### Touch Device Detection

Detect touch-capable devices:

```ts
import { isTouchDevice } from '@sky-modules/web/helpers/isTouchDevice'

if (isTouchDevice()) {
  // Enable touch-friendly UI
  increaseTouchTargetSizes()
} else {
  // Enable hover states for mouse
  enableHoverEffects()
}
```

**Global usage:**

```ts
import '@sky-modules/web/helpers/global'

if (isTouchDevice()) {
  // Available globally
}
```

## API

### HTML_TAGS

Array of all standard HTML5 element names.

**Categories:**
- Document metadata
- Content sectioning
- Text content
- Inline text semantics
- Image and multimedia
- Embedded content
- Scripting
- Table content
- Forms
- Interactive elements
- Web Components

### isIos()

Returns `true` if running on iOS device (iPhone, iPad, iPod, iPadOS).

**Detection:**
- Checks user agent for iPhone/iPad/iPod
- Detects iPadOS (MacIntel with touch support)

### getIosVersion()

Returns iOS major version number or `null` if not iOS.

### isTouchDevice()

Returns `true` if device uses touch as primary input method.

**Detection:**
- Uses media query `(pointer: coarse)`
- More reliable than `ontouchstart` or `maxTouchPoints`

## Implementation Notes

- All helpers available globally via `global/` imports
- iOS detection handles iPadOS masquerading as MacIntel
- Touch detection uses pointer media query for accuracy
- HTML_TAGS includes all standard elements up to HTML5

## Related Modules

- [@sky-modules/platform](../platform/) - Platform detection
- [@sky-modules/universal](../universal/) - Universal components
