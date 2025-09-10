// src/lib/vike-handler.ts
import { renderPage } from 'vike/server'

import type { HonoEnv } from './hono'

export const vikeHandler = async (c: HonoEnv) => {
    // Преобразуем запрос Hono в формат, понятный Vike
    const pageContext = await renderPage({
        urlOriginal: c.req.url,
        headersOriginal: Object.fromEntries(c.req.raw.headers),
        // Передаем объект запроса, чтобы Vike мог получить к нему доступ
        request: c.req.raw,
    })

    // Обрабатываем ответ от Vike
    if (pageContext.httpResponse) {
        const { statusCode, body, contentType } = pageContext.httpResponse

        // Устанавливаем статус и заголовки
        c.status(statusCode)
        c.header('Content-Type', contentType)

        // Возвращаем тело ответа
        return c.body(body)
    }

    // Если Vike не вернул ответ (например, для перенаправлений)
    return c.text('Not Found', 404)
}
