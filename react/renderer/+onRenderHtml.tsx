import { renderToStream } from 'react-streaming/server'
import { escapeInject } from 'vike/server'
import { PageContextServer } from 'vike/types'

import faviconSvg from '/favicon.svg'

export default async function onRenderHtml(
    pageContext: PageContextServer,
    html?: ReactNode
): Promise<{
    documentHtml: ReturnType<typeof escapeInject>
    pageContext: {}
}> {
    const stream = await renderToStream(
        <html>
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" href={faviconSvg} />
                <title>EmptySet</title>
            </head>
            <body>
                <div id="root">{<pageContext.Page />}</div>
            </body>
        </html>,
        {
            userAgent: pageContext.headers?.['user-agent'] ?? 'unknown',
        }
    )

    const documentHtml = escapeInject`<!DOCTYPE html>${stream}`

    return {
        documentHtml,
        pageContext: {
            // We can add custom pageContext properties here, see https://vike.dev/pageContext#custom
        },
    }
}
