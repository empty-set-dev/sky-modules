export { onRenderClient }

import { hydrateRoot, Root } from 'react-dom/client'
import PageContextProvider from 'sky/react/PageContextProvider'

import type { PageContextClient } from 'vike/types'

let root: Root
let globalAbortController: null | AbortController = null
async function onRenderClient(pageContext: PageContextClient): Promise<void> {
    const { Page } = pageContext

    console.log('------->', pageContext.config)

    function Root(): ReactNode {
        return (
            <PageContextProvider pageContext={pageContext}>
                <Page />
            </PageContextProvider>
        )
    }

    if (!pageContext.isHydration) {
        globalAbortController?.abort()

        const asyncData = pageContext.config['async-data']

        if (asyncData && asyncData.length > 0) {
            async(async () => {
                const abortController = (globalAbortController = new AbortController())
                pageContext.data = (
                    await Promise.all(
                        asyncData.map(asyncData =>
                            (async (): Promise<object> => {
                                return await asyncData(pageContext, abortController.signal)
                            })()
                        )
                    )
                ).reduce((data: object, currentData: object) => {
                    return Object.assign(data, currentData)
                }, {})

                if (!abortController.signal.aborted) {
                    globalAbortController = null
                    root.render(<Root />)
                }
            })
        }
    }

    if (root) {
        root.render(<Root />)
        Console.success('Rendered', pageContext.urlOriginal)
    } else {
        root = hydrateRoot(document.getElementById('root')!, <Root />)
        Console.success('Hydrated', pageContext.urlOriginal)
    }
}
