import '~project/setup'
import { FC } from 'react'
import { renderToStream } from 'react-streaming/server'
import { escapeInject } from 'vike/server'

import type { PageContextServer } from 'vike/types'

import faviconSvg from '~public/favicon.svg'

/**
 * Vike server-side rendering hook for React
 *
 * Renders React components to HTML stream on the server.
 * - Streams HTML for better performance
 * - Includes HTML shell with meta tags
 * - Sets up root and modal-root containers
 * - Handles user-agent detection for SSR
 *
 * @param pageContext - Vike page context with Page component and headers
 * @returns Document HTML and updated page context
 *
 * @example
 * ```ts
 * // Configured in vike/config.ts
 * export default {
 *   onRenderHtml: 'import:@sky-modules/react/vike/+onRenderHtml:default'
 * }
 * ```
 *
 * @see {@link https://vike.dev/onRenderHtml}
 */
export default async function onRenderHtml(pageContext: PageContextServer): Promise<{
    documentHtml: ReturnType<typeof escapeInject>
    pageContext: {}
}> {
    const Page = pageContext.Page as FC

    const root = <Page />

    const stream = await renderToStream(
        <html>
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" href={faviconSvg} />
                <title>Empty Set</title>
            </head>
            <body>
                <div id="root">{root}</div>
                <div id="modal-root"></div>
            </body>
        </html>,
        {
            userAgent: pageContext.headers?.['user-agent'] ?? 'unknown',
        }
    )

    const documentHtml = escapeInject`<!DOCTYPE html>${stream}`

    return {
        documentHtml,
        pageContext: {},
    }
}
