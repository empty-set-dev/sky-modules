// https://vike.dev/onRenderClient
import '[examples]/cameras/SkyPerspectiveCamera/imports'

import ReactDOM from 'react-dom/client'

import { getPageTitle } from './getPageTitle'
import { PageLayout } from './PageLayout'

import type { OnRenderClientAsync } from 'vike/types'

let root: ReactDOM.Root
export const onRenderClient: OnRenderClientAsync = async (
    pageContext
): ReturnType<OnRenderClientAsync> => {
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

    const page = (
        <PageLayout pageContext={pageContext}>
            <Page />
        </PageLayout>
    )

    if (pageContext.isHydration) {
        root = ReactDOM.hydrateRoot(container, page)
    } else {
        if (!root) {
            root = ReactDOM.createRoot(container)
        }

        root.render(page)
    }

    document.title = getPageTitle(pageContext)
}
