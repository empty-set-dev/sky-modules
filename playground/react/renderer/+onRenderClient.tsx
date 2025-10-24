import '#setup'
import Console from '@sky-modules/core/Console'
import { ReactNode } from 'react'
import { hydrateRoot, Root } from 'react-dom/client'

import type { PageContextClient } from 'vike/types'

let root: Root
let globalAbortController: null | AbortController = null
export default async function onRenderClient(pageContext: PageContextClient): Promise<void> {
    const { Page } = pageContext

    function Root(): ReactNode {
        return <Page />
    }

    if (root) {
        root.render(<Root />)
        Console.success('Rendered', pageContext.urlOriginal)
    } else {
        root = hydrateRoot(document.getElementById('root')!, <Root />)
        Console.success('Hydrated', pageContext.urlOriginal)
    }
}
