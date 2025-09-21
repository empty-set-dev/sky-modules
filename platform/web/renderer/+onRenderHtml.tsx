// // https://vike.dev/onRenderHtml
// // import { QueryClient } from 'pkgs/@tanstack/react-query'
// // import { renderToStream } from 'react-streaming/server'
// import { PageContextProvider } from 'sky/react/PageContext'
// import { escapeInject, dangerouslySkipEscape } from 'vike/server'

// import PageProviders from '../../../examples/react/old-render/PageProviders'

// import type { PageContextServer } from 'vike/types'

// import logoUrl from '@/favicon.svg'

// export default async function onRenderHtml(pageContext: PageContextServer): Promise<{
//     documentHtml: ReturnType<typeof escapeInject>
//     pageContext: {}
// }> {
//     // const queryClient = new QueryClient()

//     const { Page, headers } = pageContext

//     // This onRenderHtml() hook only supports SSR, see https://vike.dev/render-modes for how to modify
//     // onRenderHtml() to support SPA
//     if (!Page) {
//         throw new Error('My onRenderHtml() hook expects pageContext.Page to be defined')
//     }

//     // let stream: Awaited<ReturnType<typeof renderToStream>>

//     const renderToStreamOptions: { userAgent?: string } = {}
//     if (headers != null && headers['user-agent'] != null) {
//         renderToStreamOptions.userAgent = headers['user-agent']
//     }

//     // const title = pageContext.title
//     // const description = pageContext.description

//     // let ogTitle: string
//     // let ogType: string
//     // let ogImage: string

//     // if (pageContext.ogTitle) {
//     //     ogTitle = pageContext.ogTitle
//     // }

//     // if (pageContext.ogType) {
//     //     ogType = pageContext.ogType
//     // }

//     // if (pageContext.ogImage) {
//     //     ogImage = pageContext.ogImage
//     // }

//     // const canonicalUrl = `https://${pageContext.domain}${pageContext.urlPathname}`

//     // const documentHtml = escapeInject`<!DOCTYPE html>
//     //     <html lang="${pageContext.lng}">
//     //     <head>
//     //         <meta charset="UTF-8" />
//     //         <link rel="icon" href="${logoUrl}" />
//     //         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     //         <title>${title}</title>
//     //         <meta name="description" content="${description}" />
//     //         ${
//     //             ogTitle!
//     //                 ? dangerouslySkipEscape(`<meta name='og:title' content="${ogTitle}" />`)
//     //                 : ''
//     //         }
//     //         ${ogType! ? dangerouslySkipEscape(`<meta name='og:type' content="${ogType}" />`) : ''}
//     //         ${
//     //             ogImage!
//     //                 ? dangerouslySkipEscape(`<meta name='og:image' content="${ogImage}" />`)
//     //                 : ''
//     //         }
//     //         ${
//     //             pageContext.noIndex
//     //                 ? dangerouslySkipEscape(`<meta name="robots" content="noindex"/>`)
//     //                 : ''
//     //         }

//     //         <link rel="canonical" href="${canonicalUrl}" />

//     //         ${
//     //             pageContext.preloads
//     //                 ? dangerouslySkipEscape(
//     //                       pageContext.preloads
//     //                           .map(preload =>
//     //                               preload[1] === 'font'
//     //                                   ? `<link
//     //                                         rel="preload"
//     //                                         href="${preload[0]}"
//     //                                         as="${preload[1]}"
//     //                                         crossorigin='anonymous'
//     //                                     />`
//     //                                   : `<link rel="preload" href="${preload[0]}" as="${preload[1]}" />`
//     //                           )
//     //                           .join('')
//     //                   )
//     //                 : ''
//     //         }
//     //     </head>
//     //     <body ${
//     //         pageContext.theme
//     //             ? dangerouslySkipEscape(`
//     //         class="theme-${pageContext.theme}"
//     //     `)
//     //             : ''
//     //     }>
//     //         <div id="root">1234</div>
//     //         <div id="modal-root"></div>
//     //     </body>
//     //     </html>`

//     return {
//         documentHtml,
//         pageContext: {
//             // We can add custom pageContext properties here, see https://vike.dev/pageContext#custom
//         },
//     }
// }
