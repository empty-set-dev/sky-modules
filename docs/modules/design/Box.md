# Box

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  Box utility module
</div>

Universal polymorphic component with Panda CSS, Tailwind, and full CSS properties support. Globally available across all frameworks.

## Installation

```bash
npm install @sky-modules/design
```

Then import the Box global definition:

```typescript
import '@sky-modules/react/Box'  // React
import '@sky-modules/vue/Box'    // Vue
import '@sky-modules/solid/Box'  // Solid
// ... or other framework
```

## Features

- **Globally available** - Use `<Box>` without imports after setup
- **Panda CSS props** - Type-safe design system properties
- **Tailwind support** - Via `sx` prop for utility classes
- **Standard className** - Works with regular CSS classes
- **Polymorphic** - Render as any HTML element or component via `as` prop
- **asChild pattern** - Merge props with child element
- **Zero runtime** - Styles extracted at build time
- **Cross-framework** - Same API across React, Vue, Solid, Svelte, etc.

## Usage

### Basic Box

```tsx
<Box
    backgroundColor="primary.500"
    padding="4"
    borderRadius="md"
    color="white"
>
    Content here
</Box>
```

### With Tailwind (sx prop)

```tsx
<Box sx="hover:shadow-lg transition-all duration-300">
    Tailwind styled content
</Box>

<Box
    sx="flex items-center gap-4 p-4 rounded-lg"
    backgroundColor="primary.500"
>
    Combined Tailwind + Panda
</Box>
```

### With className

```tsx
<Box className="my-custom-class">
    Standard CSS class
</Box>
```

### Responsive Styling

```tsx
<Box
    padding={{ base: '2', md: '4', lg: '6' }}
    fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
>
    Responsive content
</Box>
```

### Flex Layout

```tsx
<Box
    display="flex"
    alignItems="center"
    justifyContent="space-between"
    gap="4"
>
    <Box>Left</Box>
    <Box>Right</Box>
</Box>
```

### Polymorphic Component (as prop)

Render as different HTML elements:

```tsx
<Box as="section">
    Section content
</Box>

<Box as="article">
    Article content
</Box>

<Box as="nav">
    Navigation
</Box>
```

Or as a component:

```tsx
<Box as={MyComponent} customProp="value">
    Component content
</Box>
```

### asChild Pattern

Merge Box props with child element:

```tsx
<Box asChild padding="4" backgroundColor="blue.100">
    <button>
        Styled button
    </button>
</Box>

// Renders as:
// <button class="p-4 bg-blue-100">Styled button</button>
```

## Props

### BoxProps

```typescript
type BoxProps<T = 'div'> = {
    // Polymorphic
    as?: T  // HTML element tag or component

    // Styling
    sx?: string | string[]  // Tailwind/utility classes
    className?: string      // Standard CSS classes

    // Panda CSS properties (full CSS support)
    // Layout
    display?: 'flex' | 'block' | 'inline' | 'grid' | ...
    position?: 'relative' | 'absolute' | 'fixed' | ...

    // Spacing
    padding?: string | number
    margin?: string | number
    p?: string | number  // shorthand
    m?: string | number  // shorthand
    px?: string | number // padding-x
    py?: string | number // padding-y
    mx?: string | number // margin-x
    my?: string | number // margin-y

    // Colors
    backgroundColor?: string
    color?: string
    borderColor?: string

    // Typography
    fontSize?: string | number
    fontWeight?: string | number
    lineHeight?: string | number
    textAlign?: 'left' | 'center' | 'right' | ...

    // Flexbox
    flexDirection?: 'row' | 'column' | ...
    alignItems?: 'center' | 'start' | 'end' | ...
    justifyContent?: 'center' | 'space-between' | ...
    gap?: string | number

    // Grid
    gridTemplateColumns?: string
    gridGap?: string | number

    // Borders
    border?: string
    borderRadius?: string | number
    borderWidth?: string | number

    // Sizing
    width?: string | number
    height?: string | number
    minWidth?: string | number
    maxWidth?: string | number

    // And all other CSS properties...

    // Behavior
    asChild?: boolean  // Merge props with child element
    children?: ReactNode
    ref?: Ref<HTMLElement>
} & (T extends keyof JSX.IntrinsicElements
    ? JSX.IntrinsicElements[T]  // HTML attributes for element
    : T extends (props: infer P) => any
      ? P  // Component props
      : {})
```

## Design Tokens

Box integrates with your design system tokens:

```tsx
<Box
    backgroundColor="primary.500"     // Semantic color
    padding="4"                       // Spacing token (1rem)
    borderRadius="md"                 // Border radius token
    fontSize="lg"                     // Font size token
    boxShadow="md"                    // Shadow token
>
    Themed content
</Box>
```

Available token categories:
- Colors: `primary.*`, `secondary.*`, `gray.*`, `red.*`, etc.
- Spacing: `0`, `1`, `2`, `4`, `6`, `8`, `12`, `16`, etc.
- Font sizes: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, etc.
- Border radius: `sm`, `md`, `lg`, `xl`, `full`
- Shadows: `sm`, `md`, `lg`, `xl`, `2xl`

## Combining Styling Approaches

You can mix Panda CSS props, Tailwind classes, and regular CSS:

```tsx
<Box
    // Panda CSS props
    padding="4"
    backgroundColor="primary.500"

    // Tailwind via sx
    sx="hover:scale-105 transition-transform"

    // Standard CSS class
    className="custom-animation"
>
    Multi-styled content
</Box>
```

## TypeScript Support

Box is fully type-safe:

```tsx
// Correct - valid CSS property
<Box display="flex" />

// Error - invalid value
<Box display="invalid" />

// Autocomplete for design tokens
<Box backgroundColor="primary." /* autocomplete shows: 50, 100, 200... 900 */ />

// Polymorphic types
<Box as="button" onClick={(e) => {}} /> // onClick is typed correctly
<Box as={MyComponent} myProp="value" />  // myProp from MyComponent props
```

## Cross-Framework Usage

Box works identically across all supported frameworks:

**React:**
```tsx
import '@sky-modules/react/Box'

<Box padding="4">React Box</Box>
```

**Vue:**
```vue
<script setup>
import '@sky-modules/vue/Box'
</script>

<Box padding="4">Vue Box</Box>
```

**Solid:**
```tsx
import '@sky-modules/solid/Box'

<Box padding="4">Solid Box</Box>
```

Same API, same behavior, compiled for each framework via Mitosis.

## Files

### Box.global.d.ts

**Purpose:** Global TypeScript definitions for Box component and related types

**Key exports:**
- `Box` - Global Box function component
- `BoxProps<T>` - Polymorphic props type
- `BoxOwnProps` - Core Box properties
- `BoxElementProps<T>` - Props when rendering as HTML element
- `BoxComponentProps<P>` - Props when rendering as component
- `BoxSxProp` - Type for sx prop (Tailwind classes)
- `BoxAs` - Valid 'as' prop values

### global/index.ts

**Purpose:** Registers Box component globally (triple-slash reference to global types)

### types/

**Purpose:** Generated Panda CSS type definitions

Auto-generated files providing type-safe CSS property definitions, design tokens, and conditions for the Box component. These files are generated by Panda CSS and should not be edited manually.
