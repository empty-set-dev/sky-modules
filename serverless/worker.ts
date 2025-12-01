/**
 * Cloudflare Worker entry point
 *
 * Standard Cloudflare Worker export that integrates Hono application.
 * Provides the fetch handler interface required by Cloudflare Workers runtime.
 *
 * @example Basic setup
 * ```typescript
 * import app from './hono'
 *
 * export default {
 *     async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
 *         return app.fetch(request, env, ctx)
 *     },
 * }
 *
 * export type { HonoEnv } from './hono'
 * ```
 *
 * @example With additional handlers
 * ```typescript
 * import app from './hono'
 *
 * export default {
 *     async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
 *         return app.fetch(request, env, ctx)
 *     },
 *
 *     async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
 *         // Cron triggers
 *         console.log('Scheduled event:', event.cron)
 *     },
 *
 *     async queue(batch: MessageBatch, env: Env, ctx: ExecutionContext) {
 *         // Queue consumers
 *         for (const message of batch.messages) {
 *             console.log('Message:', message.body)
 *         }
 *     },
 * }
 * ```
 */

// import app from './hono'
//
// // Экспортируем стандартный интерфейс Worker
// export default {
//     async fetch(request: Request, env: unknown, ctx: ExecutionContext): Promise<Response> {
//         // Передаем request в Hono и возвращаем ответ
//         return app.fetch(request, env, ctx)
//     },
// }
//
// // Типы для TypeScript
// export type { HonoEnv } from './hono'
