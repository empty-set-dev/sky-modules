/**
 * Hono application setup for Cloudflare Workers
 *
 * Template for setting up Hono web framework with Cloudflare Workers.
 * Provides type-safe environment bindings and middleware configuration.
 *
 * Features:
 * - Type-safe Cloudflare bindings (KV, D1, R2, etc.)
 * - API route definitions
 * - Vike SSR integration for catch-all routes
 * - Cloudflare geolocation data access
 * - Development route debugging with showRoutes
 *
 * @example Setup
 * ```typescript
 * import { Hono } from 'hono'
 * import { showRoutes } from 'hono/dev'
 * import { vikeHandler } from './vike-handler'
 *
 * type Bindings = {
 *     MY_KV: KVNamespace
 *     MY_DB: D1Database
 * }
 *
 * type Variables = {
 *     user: User
 * }
 *
 * const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()
 *
 * // API routes
 * app.get('/api/hello', c => c.json({ message: 'Hello!' }))
 *
 * // SSR fallback
 * app.get('*', vikeHandler)
 *
 * showRoutes(app)
 * export default app
 * ```
 *
 * @example Access Cloudflare bindings
 * ```typescript
 * app.get('/api/data', async c => {
 *     const value = await c.env.MY_KV.get('key')
 *     return c.json({ value })
 * })
 * ```
 *
 * @example Cloudflare geolocation
 * ```typescript
 * app.get('/api/location', c => {
 *     return c.json({
 *         city: c.req.raw?.cf?.city,
 *         country: c.req.raw?.cf?.country
 *     })
 * })
 * ```
 */

// // src/lib/hono.ts
// import { Hono } from 'hono'
// import { showRoutes } from 'hono/dev'
//
// import { vikeHandler } from './vike-handler' // Мы создадим это позже
//
// // Типизация для Environment Variables Cloudflare
// type Bindings = {
//     // Сюда можно добавить bindings (например, KV namespaces, D1 DB, etc.)
//     // MY_KV: KVNamespace;
// }
//
// type Variables = {
//     // Сюда можно добавить переменные, которые будут доступны в middleware
//     // user: User;
// }
//
// export type HonoEnv = {
//     Bindings: Bindings
//     Variables: Variables
// }
//
// // Создаем экземпляр Hono
// const app = new Hono<HonoEnv>()
//
// // API Routes
// app.get('/api/hello', c => {
//     // Доступ к env: c.env.MY_KV
//     return c.json({
//         message: 'Hello from Hono on Cloudflare Workers!',
//         // Используем геоданные от Cloudflare
//         location: {
//             city: c.req.raw?.cf?.city || 'Unknown',
//             country: c.req.raw?.cf?.country || 'Unknown',
//             colo: c.req.raw?.cf?.colo || 'Unknown',
//         },
//     })
// })
//
// app.post('/api/echo', async c => {
//     const body = await c.req.json()
//     return c.json({ echoed: body, timestamp: new Date().toISOString() })
// })
//
// // Обработчик для всех остальных запросов - передаем их Vike для SSR
// app.get('*', vikeHandler)
//
// // Показывает все routes в dev режиме (очень полезно для отладки)
// showRoutes(app)
//
// export default app
