// https://vike.dev/onRenderHtml
import { QueryClient } from '@tanstack/react-query'
import ReactDOMServer from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'

import PageProviders from './PageProviders'

import logoUrl from '/favicon.svg'

import { PageContextProvider } from './usePageContext'

import type { OnRenderHtmlAsync } from 'vike/types'

import '#/server'

export const onRenderHtml: OnRenderHtmlAsync = async (
    pageContext
): ReturnType<OnRenderHtmlAsync> => {
    if (pageContext.isClientSideNavigation) {
        return {
            documentHtml: escapeInject``,
            pageContext: {},
        }
    }

    const queryClient = new QueryClient()

    const { Page } = pageContext

    // This onRenderHtml() hook only supports SSR, see https://vike.dev/render-modes for how to modify
    // onRenderHtml() to support SPA
    if (!Page) {
        throw new Error('My onRenderHtml() hook expects pageContext.Page to be defined')
    }

    // Alternativly, we can use an HTML stream, see https://vike.dev/streaming
    let pageHtml: string

    if (pageContext.errorWhileRendering || pageContext.is404) {
        pageHtml = ReactDOMServer.renderToString(
            <PageContextProvider pageContext={pageContext}>
                <Page />
            </PageContextProvider>
        )
    } else {
        pageHtml = ReactDOMServer.renderToString(
            <PageProviders pageContext={pageContext} queryClient={queryClient}>
                <Page />
            </PageProviders>
        )
    }

    const title = pageContext.title
    const description = pageContext.description

    let ogTitle: string
    let ogType: string
    let ogImage: string

    if (pageContext.ogTitle) {
        ogTitle = pageContext.ogTitle
    }

    if (pageContext.ogType) {
        ogType = pageContext.ogType
    }

    if (pageContext.ogImage) {
        ogImage = pageContext.ogImage
    }

    const canonicalUrl = `https://${pageContext.domain}${pageContext.urlPathname}`

    const documentHtml = escapeInject`<!DOCTYPE html>
        <html lang="${pageContext.lng}">
        <head>
            <meta charset="UTF-8" />
            <link rel="icon" href="${logoUrl}" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${title}</title>
            <meta name="description" content="${description}" />
            ${
                ogTitle!
                    ? dangerouslySkipEscape(`<meta name='og:title' content="${ogTitle}" />`)
                    : ''
            }
            ${ogType! ? dangerouslySkipEscape(`<meta name='og:type' content="${ogType}" />`) : ''}
            ${
                ogImage!
                    ? dangerouslySkipEscape(`<meta name='og:image' content="${ogImage}" />`)
                    : ''
            }
            ${
                pageContext.noIndex
                    ? dangerouslySkipEscape(`<meta name="robots" content="noindex"/>`)
                    : ''
            }

            <link rel="canonical" href="${canonicalUrl}" />

            ${
                pageContext.preloads
                    ? dangerouslySkipEscape(
                          pageContext.preloads
                              .map(preload =>
                                  preload[1] === 'font'
                                      ? `<link
                        rel="preload"
                        href="${preload[0]}"
                        as="${preload[1]}"
                        crossorigin='anonymous'
                    />`
                                      : `<link rel="preload" href="${preload[0]}" as="${preload[1]}" />`
                              )
                              .join('')
                      )
                    : ''
            }
        </head>
        <body>
            <div id="react-root">${dangerouslySkipEscape(pageHtml)}</div>
            <div id="modal-root"></div>
        </body>
        </html>`

    return {
        documentHtml,
        pageContext: {
            // We can add custom pageContext properties here, see https://vike.dev/pageContext#custom
        },
    }
}
