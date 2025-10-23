import { renderToStream } from 'react-streaming/server'
import { escapeInject } from 'vike/server'
import { PageContextServer } from 'vike/types'

import Internal from '../Internal'

import faviconSvg from '@/favicon.svg'

export default async function onRenderHtml(pageContext: PageContextServer): Promise<{
    documentHtml: ReturnType<typeof escapeInject>
    pageContext: {}
}> {
    const Page = pageContext.Page as FC
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
        <Internal.PageContext.Provider value={pageContext}>
            <Page />
        </Internal.PageContext.Provider>
    )

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
