# Fetch

Extended fetch API with convenient helpers for common patterns.

## Installation

```typescript
import '@sky-modules/core/fetch'
```

## API

### fetch.call(url, init?)

Execute a fetch request with optional parameters.

```typescript
fetch.call(url: RequestInfo | URL, init?: FetchRequestInit): Promise<Response>
```

**Parameters:**
- `url` - Request URL
- `init` - Optional request initialization

**Returns:** Promise<Response>

### fetch.json(url, init?)

Execute a fetch request and parse JSON response.

```typescript
fetch.json<T>(url: RequestInfo | URL, init?: FetchRequestInit): Promise<T>
```

**Parameters:**
- `url` - Request URL
- `init` - Optional request initialization

**Returns:** Promise<T>

### fetch.text(url, init?)

Execute a fetch request and get text response.

```typescript
fetch.text(url: RequestInfo | URL, init?: FetchRequestInit): Promise<string>
```

**Parameters:**
- `url` - Request URL
- `init` - Optional request initialization

**Returns:** Promise<string>

### FetchRequestInit

Extended RequestInit with params support.

```typescript
interface FetchRequestInit extends Omit<RequestInit, 'body'> {
  params?: Record<string, unknown>
}
```

**Properties:**
- `params` - Query parameters object (added to URL for GET requests)

## Usage

### Fetch JSON Data

```typescript
import '@sky-modules/core/fetch'

const data = await fetch.json<User>('/api/users/123')
console.log(data.name)
```

### Fetch Text

```typescript
const html = await fetch.text('/api/html-template')
console.log(html)
```

### GET with Query Parameters

```typescript
const response = await fetch.call('/api/search', {
  params: { q: 'typescript', limit: 10 }
})
// URL becomes: /api/search?q=typescript&limit=10
```

### POST with Headers

```typescript
const data = await fetch.json('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  params: { name: 'John', email: 'john@example.com' }
})
```

### With Credentials

```typescript
const data = await fetch.json('/api/protected', {
  credentials: 'include',
  params: { token: 'xyz' }
})
```

## Notes

- `params` are converted to query string for GET requests
- `params` are converted to JSON body for non-GET requests
- Null/undefined values in params are skipped
- All helpers use native fetch under the hood
