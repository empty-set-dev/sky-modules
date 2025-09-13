import 'sky/design/plugins/tailwind.css'

import { renderToStream } from 'react-streaming/server'
import PageContext from 'sky/react/PageContextProvider'
import { escapeInject } from 'vike/server'
import { PageContextServer } from 'vike/types'

import faviconSvg from '/favicon.svg'

export default async function onRenderHtml(pageContext: PageContextServer): Promise<{
    documentHtml: ReturnType<typeof escapeInject>
    pageContext: {}
}> {
    const { Page } = pageContext
    const asyncData = pageContext.config['async-data']

    if (asyncData && asyncData.length > 0) {
        const abortController = new AbortController()
        pageContext.data = (
            await Promise.all(
                asyncData.map(asyncData => asyncData(pageContext, abortController.signal))
            )
        ).reduce((data: object, currentData: object) => {
            return Object.assign(data, currentData)
        }, {})
    }

    const root = (
        <PageContext pageContext={pageContext}>
            <Page />
        </PageContext>
    )

    const stream = await renderToStream(
        <html>
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" href={faviconSvg} />
                <title>EmptySet</title>
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
