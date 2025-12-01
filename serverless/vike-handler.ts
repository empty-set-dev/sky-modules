/**
 * Vike SSR handler for Cloudflare Workers with Hono
 *
 * Integrates Vike server-side rendering with Hono routing on Cloudflare Workers.
 * Handles page rendering and response conversion from Vike to Hono format.
 *
 * @example Basic setup
 * ```typescript
 * import { renderPage } from 'vike/server'
 * import type { Context } from 'hono'
 *
 * export const vikeHandler = async (c: Context) => {
 *     const pageContext = await renderPage({
 *         urlOriginal: c.req.url,
 *         headersOriginal: Object.fromEntries(c.req.raw.headers),
 *         request: c.req.raw,
 *     })
 *
 *     if (pageContext.httpResponse) {
 *         const { statusCode, body, contentType } = pageContext.httpResponse
 *         c.status(statusCode)
 *         c.header('Content-Type', contentType)
 *         return c.body(body)
 *     }
 *
 *     return c.text('Not Found', 404)
 * }
 * ```
 *
 * @example With error handling
 * ```typescript
 * export const vikeHandler = async (c: Context) => {
 *     try {
 *         const pageContext = await renderPage({
 *             urlOriginal: c.req.url,
 *             headersOriginal: Object.fromEntries(c.req.raw.headers),
 *             request: c.req.raw,
 *         })
 *
 *         if (!pageContext.httpResponse) {
 *             return c.text('Not Found', 404)
 *         }
 *
 *         const { statusCode, body, contentType, headers } = pageContext.httpResponse
 *
 *         c.status(statusCode)
 *         c.header('Content-Type', contentType)
 *         headers?.forEach(([name, value]) => c.header(name, value))
 *
 *         return c.body(body)
 *     } catch (error) {
 *         console.error('SSR error:', error)
 *         return c.text('Internal Server Error', 500)
 *     }
 * }
 * ```
 */

// // src/lib/vike-handler.ts
// import { renderPage } from 'vike/server'
//
// import type { HonoEnv } from './hono'
//
// export const vikeHandler = async (c: HonoEnv) => {
//     // Преобразуем запрос Hono в формат, понятный Vike
//     const pageContext = await renderPage({
//         urlOriginal: c.req.url,
//         headersOriginal: Object.fromEntries(c.req.raw.headers),
//         // Передаем объект запроса, чтобы Vike мог получить к нему доступ
//         request: c.req.raw,
//     })
//
//     // Обрабатываем ответ от Vike
//     if (pageContext.httpResponse) {
//         const { statusCode, body, contentType } = pageContext.httpResponse
//
//         // Устанавливаем статус и заголовки
//         c.status(statusCode)
//         c.header('Content-Type', contentType)
//
//         // Возвращаем тело ответа
//         return c.body(body)
//     }
//
//     // Если Vike не вернул ответ (например, для перенаправлений)
//     return c.text('Not Found', 404)
// }
