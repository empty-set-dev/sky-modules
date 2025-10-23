import Console from '@sky-modules/core/Console'
import { hydrateRoot, Root } from 'react-dom/client'

import Internal from '../Internal'

import type { PageContextClient } from 'vike/types'

let root: Root
let globalAbortController: null | AbortController = null
export default async function onRenderClient(pageContext: PageContextClient): Promise<void> {
    const { Page } = pageContext

    function Root(): ReactNode {
        return (
            <Internal.PageContext.Provider value={pageContext}>
                <Page />
            </Internal.PageContext.Provider>
        )
    }

    if (!pageContext.isHydration) {
        globalAbortController?.abort()

        const asyncData = pageContext.config['async-data']

        if (asyncData && asyncData.length > 0) {
            fire(async () => {
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
