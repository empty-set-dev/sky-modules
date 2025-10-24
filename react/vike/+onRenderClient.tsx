import '@sky-modules/platform'
import Console from '@sky-modules/core/Console'
import { ReactNode } from 'react'
import { hydrateRoot, Root } from 'react-dom/client'

import type { PageContextClient } from 'vike/types'

let root: Root
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
