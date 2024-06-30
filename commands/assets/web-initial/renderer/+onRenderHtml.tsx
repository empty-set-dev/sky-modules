// https://vike.dev/onRenderHtml
import ReactDOMServer from 'libs/react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'

import logoUrl from '/favicon.svg'

import { getPageTitle } from './getPageTitle'
import { PageLayout } from './PageLayout'

import type { OnRenderHtmlAsync } from 'vike/types'

export const onRenderHtml: OnRenderHtmlAsync = async (
    pageContext
): ReturnType<OnRenderHtmlAsync> => {
    const { Page } = pageContext

    // This onRenderHtml() hook only supports SSR, see https://vike.dev/render-modes for how to modify
    // onRenderHtml() to support SPA
    if (!Page) {
        throw new Error('My onRenderHtml() hook expects pageContext.Page to be defined')
    }

    // Alternativly, we can use an HTML stream, see https://vike.dev/streaming
    const pageHtml = ReactDOMServer.renderToString(
        <PageLayout pageContext={pageContext}>
            <Page />
        </PageLayout>
    )

    // See https://vike.dev/head
    const title = getPageTitle(pageContext)
    const desc =
        pageContext.data?.description || pageContext.config.description || 'Demo of using Vike'

    const documentHtml = escapeInject`
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <link rel="icon" href="${logoUrl}" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content="${desc}" />
                <title>${title}</title>
            </head>
            <body>
                <div id="react-root">${dangerouslySkipEscape(pageHtml)}</div>
            </body>
        </html>
    `

    return {
        documentHtml,
        pageContext: {
            // We can add custom pageContext properties here, see https://vike.dev/pageContext#custom
        },
    }
}
