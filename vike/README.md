# @sky-modules/vike

Vike SSR integration with cross-framework support via Mitosis.

## Installation

```bash
npm install @sky-modules/vike
```

## Features

- PageContext provider and hook (Mitosis-based)
- SSR control configuration
- Async data fetching during SSR

## Modules

This package has separate modules:

- **vike/PageContext** - Context provider and hook
- **vike/config** - SSR configuration helpers
- **vike/async-data** - Server-side data fetching

## Usage

### PageContext

Provide and consume Vike PageContext in components:

```tsx
import PageContextProvider from '@sky-modules/vike/PageContext'
import usePageContext from '@sky-modules/vike/PageContext/usePageContext'

// In layout
export default function Layout({ pageContext, children }) {
  return (
    <PageContextProvider value={pageContext}>
      {children}
    </PageContextProvider>
  )
}

// In component
function MyComponent() {
  const pageContext = usePageContext()

  return <div>Current URL: {pageContext.urlPathname}</div>
}
```

**Global usage:**

```tsx
import '@sky-modules/vike/PageContext/global'

<PageContextProvider value={pageContext}>
  <App />
</PageContextProvider>
```

### SSR Effect

Control SSR per-page:

```ts
// +config.ts
import ssrEffect from '@sky-modules/vike/config/ssrEffect'

export default {
  meta: {
    ssr: {
      env: { config: true },
      effect: ssrEffect
    }
  }
}
```

```ts
// +Page.ts - Disable SSR for specific page
export const ssr = false // Client-side only rendering
```

### Async Data

Fetch data during SSR:

```ts
// +Page.ts
export const config = {
  'async-data': [
    async (pageContext, signal) => {
      const user = await fetchUser(pageContext.routeParams.id, signal)
      return { user }
    }
  ]
}

// In component
function UserPage() {
  const { data } = usePageContext()
  return <div>{data.user.name}</div>
}
```

## API

### PageContextProvider

Mitosis component that provides PageContext to children.

**Props:**
- `value: Vike.PageContext` - PageContext from Vike
- `children?: Mitosis.Children` - Child components

### usePageContext()

Hook to access PageContext in components.

**Returns:** `Vike.PageContext`

### ssrEffect

Vike config effect for SSR control.

**Parameters:**
- `configDefinedAt: string` - Config location
- `configValue: boolean` - SSR enabled/disabled

**Returns:** Meta configuration for Page environment

### onBeforeRenderHtml

Async data fetching hook for SSR.

**Parameters:**
- `pageContext: PageContextServer` - Server-side context
- `html: string` - HTML string

**Returns:** `Promise<string>` - HTML string (unchanged)

## Implementation Notes

- PageContext uses Mitosis context, works in all frameworks
- Components compile to React, Vue, Solid, Svelte, Qwik, Angular
- SSR effect controls client/server Page loading
- Async data runs in parallel with AbortController support
- All exports available globally via `global/` imports

## Related Modules

- [@sky-modules/universal](../universal/) - Universal components
- [@sky-modules/platform](../platform/) - Platform detection
