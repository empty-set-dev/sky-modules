export { onRenderClient }

import { hydrateRoot, Root } from 'react-dom/client'

import type { PageContextClient } from 'vike/types'

let root: Root
async function onRenderClient(pageContext: PageContextClient) {
    const { Page } = pageContext

    if (root) {
        root.render(<Page />)
    } else {
        root = hydrateRoot(document.getElementById('root')!, <Page />)
    }
}
