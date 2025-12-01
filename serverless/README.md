# Serverless Module

Templates and utilities for deploying applications to Cloudflare Workers with Hono and Vike SSR.

## Installation

```bash
npm install @sky-modules/serverless
npm install hono vike
```

## Features

- **Hono Integration**: Type-safe web framework for Cloudflare Workers
- **Vike SSR**: Server-side rendering with Vike
- **Cloudflare Bindings**: Type-safe access to KV, D1, R2, and other services
- **Geolocation**: Built-in access to Cloudflare request metadata
- **Template Architecture**: Pre-configured file structure for quick setup

## Quick Start

### 1. Setup Hono Application

Create `src/lib/hono.ts`:

```typescript
import { Hono } from 'hono'
import { showRoutes } from 'hono/dev'
import { vikeHandler } from './vike-handler'

// Define Cloudflare bindings
type Bindings = {
    MY_KV: KVNamespace
    MY_DB: D1Database
}

// Define middleware variables
type Variables = {
    user: User
}

export type HonoEnv = {
    Bindings: Bindings
    Variables: Variables
}

const app = new Hono<HonoEnv>()

// API routes
app.get('/api/hello', c => {
    return c.json({
        message: 'Hello from Cloudflare Workers!',
        location: {
            city: c.req.raw?.cf?.city,
            country: c.req.raw?.cf?.country,
        },
    })
})

// SSR fallback
app.get('*', vikeHandler)

showRoutes(app) // Development route debugging
export default app
```

### 2. Setup Vike Handler

Create `src/lib/vike-handler.ts`:

```typescript
import { renderPage } from 'vike/server'
import type { Context } from 'hono'

export const vikeHandler = async (c: Context) => {
    const pageContext = await renderPage({
        urlOriginal: c.req.url,
        headersOriginal: Object.fromEntries(c.req.raw.headers),
        request: c.req.raw,
    })

    if (pageContext.httpResponse) {
        const { statusCode, body, contentType } = pageContext.httpResponse
        c.status(statusCode)
        c.header('Content-Type', contentType)
        return c.body(body)
    }

    return c.text('Not Found', 404)
}
```

### 3. Setup Worker Entry Point

Create `src/worker.ts`:

```typescript
import app from './lib/hono'

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        return app.fetch(request, env, ctx)
    },
}

export type { HonoEnv } from './lib/hono'
```

### 4. Configure wrangler.toml

```toml
name = "my-app"
main = "src/worker.ts"
compatibility_date = "2024-01-01"

# KV Namespace
[[kv_namespaces]]
binding = "MY_KV"
id = "your-kv-id"

# D1 Database
[[d1_databases]]
binding = "MY_DB"
database_name = "my-database"
database_id = "your-db-id"
```

## Architecture

### Request Flow

```
Request → Worker → Hono Router → API or Vike Handler → Response
```

1. Request enters Cloudflare Worker
2. Hono router matches route
3. API routes return JSON directly
4. Other routes go to Vike for SSR
5. Response sent back through Cloudflare edge

### File Structure

```
src/
├── lib/
│   ├── hono.ts           # Hono app configuration
│   └── vike-handler.ts   # Vike SSR integration
├── pages/                # Vike pages
│   ├── index/
│   │   └── +Page.tsx
│   └── about/
│       └── +Page.tsx
└── worker.ts             # Worker entry point
```

## API Examples

### Basic API Route

```typescript
app.get('/api/data', async c => {
    const data = await fetchData()
    return c.json({ data })
})

app.post('/api/submit', async c => {
    const body = await c.req.json()
    return c.json({ success: true, data: body })
})
```

### Using Cloudflare Bindings

```typescript
// KV Storage
app.get('/api/cache/:key', async c => {
    const key = c.req.param('key')
    const value = await c.env.MY_KV.get(key)
    return c.json({ key, value })
})

app.put('/api/cache/:key', async c => {
    const key = c.req.param('key')
    const { value } = await c.req.json()
    await c.env.MY_KV.put(key, value)
    return c.json({ success: true })
})

// D1 Database
app.get('/api/users', async c => {
    const result = await c.env.MY_DB
        .prepare('SELECT * FROM users')
        .all()
    return c.json(result.results)
})
```

### Cloudflare Geolocation

```typescript
app.get('/api/location', c => {
    const cf = c.req.raw?.cf
    return c.json({
        city: cf?.city,
        country: cf?.country,
        region: cf?.region,
        timezone: cf?.timezone,
        latitude: cf?.latitude,
        longitude: cf?.longitude,
        colo: cf?.colo, // Edge location
    })
})
```

### Middleware

```typescript
// Authentication middleware
app.use('*', async (c, next) => {
    const token = c.req.header('Authorization')
    if (!token) {
        return c.json({ error: 'Unauthorized' }, 401)
    }
    c.set('user', await verifyToken(token))
    await next()
})

// CORS middleware
app.use('*', async (c, next) => {
    await next()
    c.header('Access-Control-Allow-Origin', '*')
})
```

## Vike SSR Integration

### Page Component

```typescript
// pages/index/+Page.tsx
export default function Page({ data }) {
    return (
        <div>
            <h1>Hello from SSR!</h1>
            <p>Data: {data.message}</p>
        </div>
    )
}
```

### Data Fetching

```typescript
// pages/index/+data.ts
export async function data(pageContext) {
    const response = await fetch('/api/data')
    const data = await response.json()
    return data
}
```

### Access Request in Vike

```typescript
// pages/index/+data.ts
export async function data(pageContext) {
    const request = pageContext.request as Request
    const cf = request.cf

    return {
        location: {
            city: cf?.city,
            country: cf?.country,
        },
    }
}
```

## Deployment

### Development

```bash
npm run dev
# or
wrangler dev
```

### Production

```bash
wrangler deploy
```

### Environment Variables

```toml
# wrangler.toml
[vars]
API_URL = "https://api.example.com"
DEBUG = "false"

# Secrets (use wrangler secret)
# wrangler secret put API_KEY
```

## Advanced Patterns

### Rate Limiting

```typescript
const rateLimit = new Map<string, number>()

app.use('/api/*', async (c, next) => {
    const ip = c.req.header('CF-Connecting-IP') || 'unknown'
    const count = rateLimit.get(ip) || 0

    if (count > 100) {
        return c.json({ error: 'Rate limit exceeded' }, 429)
    }

    rateLimit.set(ip, count + 1)
    await next()
})
```

### Error Handling

```typescript
app.onError((err, c) => {
    console.error('Error:', err)
    return c.json({
        error: 'Internal Server Error',
        message: err.message,
    }, 500)
})
```

### WebSocket Support

```typescript
app.get('/ws', c => {
    const upgradeHeader = c.req.header('Upgrade')
    if (upgradeHeader !== 'websocket') {
        return c.text('Expected WebSocket', 400)
    }

    const [client, server] = Object.values(new WebSocketPair())
    server.accept()

    server.addEventListener('message', event => {
        server.send(`Echo: ${event.data}`)
    })

    return new Response(null, {
        status: 101,
        webSocket: client,
    })
})
```

## Best Practices

1. **Type Safety**: Always define Bindings and Variables types
2. **Error Handling**: Use try-catch and onError handler
3. **Logging**: Use console.log for Cloudflare logs
4. **Edge Caching**: Use Cache API for static assets
5. **Cold Starts**: Minimize worker size for faster cold starts
6. **Testing**: Use wrangler dev for local testing

## Cloudflare Services

### Available Bindings

- **KV**: Key-value storage (low latency reads)
- **R2**: Object storage (S3-compatible)
- **D1**: SQL database (SQLite)
- **Durable Objects**: Stateful workers
- **Queues**: Message queues
- **Analytics Engine**: Analytics data
- **Workers AI**: AI inference

## Related Modules

- **[Hono Documentation](https://hono.dev/)**
- **[Vike Documentation](https://vike.dev/)**
- **[Cloudflare Workers](https://developers.cloudflare.com/workers/)**
- **[Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)**

## License

MIT
