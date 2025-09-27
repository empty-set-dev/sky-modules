// // src/lib/hono.ts
// import { Hono } from 'hono'
// import { showRoutes } from 'hono/dev'

// import { vikeHandler } from './vike-handler' // Мы создадим это позже

// // Типизация для Environment Variables Cloudflare
// type Bindings = {
//     // Сюда можно добавить bindings (например, KV namespaces, D1 DB, etc.)
//     // MY_KV: KVNamespace;
// }

// type Variables = {
//     // Сюда можно добавить переменные, которые будут доступны в middleware
//     // user: User;
// }

// export type HonoEnv = {
//     Bindings: Bindings
//     Variables: Variables
// }

// // Создаем экземпляр Hono
// const app = new Hono<HonoEnv>()

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

// app.post('/api/echo', async c => {
//     const body = await c.req.json()
//     return c.json({ echoed: body, timestamp: new Date().toISOString() })
// })

// // Обработчик для всех остальных запросов - передаем их Vike для SSR
// app.get('*', vikeHandler)

// // Показывает все routes в dev режиме (очень полезно для отладки)
// showRoutes(app)

// export default app
