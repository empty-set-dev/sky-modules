// https://vike.dev/onRenderClient
export { onRenderClient }

import { hydrate, QueryClient } from '@tanstack/react-query'
import ReactDOM from 'react-dom/client'
import { logConsole } from 'sky/helpers/console'

import Store from '../Store'

import currentPageContextClientData from './currentPageContextClientData'
import PageProviders from './PageProviders'

import type { OnRenderClientAsync } from 'vike/types'

window.global = window

let root: ReactDOM.Root
const client = new QueryClient()

const onRenderClient: OnRenderClientAsync = async (
    pageContext
): ReturnType<OnRenderClientAsync> => {
    if (!currentPageContextClientData.data) {
        currentPageContextClientData.data = pageContext.data

        hydrate(client, pageContext.data.dehydratedState)

        global.afterHydration = true
        global.ip = pageContext.data.ip

        setTimeout(() => {
            global.afterHydration = false
        }, 0)
    } else {
        pageContext.data = currentPageContextClientData.data
    }

    const { Page } = pageContext

    // This onRenderClient() hook only supports SSR, see https://vike.dev/render-modes for how to modify onRenderClient()
    // to support SPA
    if (!Page) {
        throw new Error('My onRenderClient() hook expects pageContext.Page to be defined')
    }

    const container = document.getElementById('react-root')

    if (!container) {
        throw new Error('DOM element #react-root not found')
    }

    const page = (
        <PageProviders pageContext={pageContext} store={{} as Store} client={client}>
            <Page />
        </PageProviders>
    )

    if (!root) {
        logConsole('Hydrate')
        root = ReactDOM.hydrateRoot(container, page)
    } else {
        logConsole('Render')
        if (!root) {
            root = ReactDOM.createRoot(container)
        }

        root.render(page)
    }
}
