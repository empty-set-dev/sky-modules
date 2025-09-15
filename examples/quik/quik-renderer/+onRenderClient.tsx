import 'sky/design/plugins/tailwind.css'

import type { PageContextClient } from 'vike/types'

let isHydrated = false
let globalAbortController: null | AbortController = null

export default async function onRenderClient(pageContext: PageContextClient): Promise<void> {
    const { Page } = pageContext

    function AppRoot() {
        return createElement(
            PageContextProvider, 
            { pageContext }, 
            createElement(ComponentWrapper, { component: Page })
        )
    }

    if (!pageContext.isHydration) {
        globalAbortController?.abort()

        const asyncData = pageContext.config['async-data']

        if (asyncData && asyncData.length > 0) {
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
                const container = document.getElementById('root')!
                renderToClient(AppRoot(), container)
                console.log('Rendered', pageContext.urlOriginal)
            }
        }
    }

    const container = document.getElementById('root')!
    
    if (!isHydrated) {
        hydrateFromServer(AppRoot(), container)
        isHydrated = true
        console.log('Hydrated', pageContext.urlOriginal)
    } else {
        renderToClient(AppRoot(), container)
        console.log('Rendered', pageContext.urlOriginal)
    }
}
