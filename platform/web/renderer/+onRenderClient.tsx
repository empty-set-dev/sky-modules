// https://vike.dev/onRenderClient
import { JSX } from 'react'
import ReactDOM from 'react-dom/client'
import { PageContextProvider } from 'sky/react/PageContextProvider'

// import PageProviders from '#/renderer/PageProviders'
// import queryClient from '#/renderer/queryClient'
import routeData from '../../../examples/platform/old-render/routeData'

import type { PageContext, PageContextClient } from 'vike/types'

let root: ReactDOM.Root
let initial: PageContext['initial']

const onRenderClient = async (pageContext: PageContextClient): Promise<void> => {
    // if (!root) {
    //     if (!pageContext.errorWhileRendering && !pageContext.is404) {
    //         Object.assign(routeData, {
    //             domain: pageContext.domain,
    //             lng: pageContext.lng,
    //             lngPrefix: pageContext.lngPrefix,
    //         })

    //         initial = pageContext.initial
    //     }
    // } else {
    //     pageContext.initial = initial
    // }

    const { Page } = pageContext

    // This onRenderClient() hook only supports SSR, see https://vike.dev/render-modes for how to modify onRenderClient()
    // to support SPA
    if (!Page) {
        throw new Error('My onRenderClient() hook expects pageContext.Page to be defined')
    }

    const container = document.getElementById('root')

    if (!container) {
        throw new Error('DOM element #root not found')
    }

    let page: JSX.Element
    if (pageContext.errorWhileRendering || pageContext.is404) {
        page = (
            // <PageContextProvider pageContext={pageContext}>
            <Page />
            // </PageContextProvider>
        )
    } else {
        page = (
            // <PageProviders pageContext={pageContext} queryClient={queryClient}>
            <Page />
            // </PageProviders>
        )
    }

    if (!root) {
        Console.debug('Hydrate')
        root = ReactDOM.hydrateRoot(container, page)
    } else {
        Console.debug('Render')

        if (!root) {
            root = ReactDOM.createRoot(container)
        }

        root.render(page)
    }
}

export default onRenderClient
