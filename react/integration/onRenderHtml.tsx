import 'sky/design/plugins/tailwind.css'

import { renderToStream } from 'react-streaming/server'
import { escapeInject } from 'vike/server'
import { PageContextServer } from 'vike/types'

import faviconSvg from '/favicon.svg'

export default async function onRenderHtml(pageContext: PageContextServer): Promise<{
    documentHtml: ReturnType<typeof escapeInject>
    pageContext: {}
}> {
    const { Page } = pageContext
    const stream = await renderToStream(
        <html>
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" href={faviconSvg} />
                <title>Sky React App</title>
            </head>
            <body>
                <div id="root">{<Page />}</div>
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
