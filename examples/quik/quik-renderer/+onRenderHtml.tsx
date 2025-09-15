import 'sky/design/plugins/tailwind.css'

import { createElement, renderToServerString } from 'sky/quik'
import PageContextProvider from 'sky/quik/extensions/PageContext'
import ComponentWrapper from 'sky/quik/compatibility/ReactWrapper'
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

    const root = createElement(
        PageContextProvider, 
        { pageContext }, 
        createElement(ComponentWrapper, { component: Page })
    )

    const { html: rootHtml } = renderToServerString(root)

    const documentHtml = escapeInject`<!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" href="${faviconSvg}" />
                <title>EmptySet</title>
            </head>
            <body>
                <div id="root">${escapeInject`${rootHtml}`}</div>
                <div id="modal-root"></div>
            </body>
        </html>`

    return {
        documentHtml,
        pageContext: {},
    }
}
