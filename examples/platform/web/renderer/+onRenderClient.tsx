export { onRenderClient }

import { hydrateRoot } from 'react-dom/client'

import type { PageContextClient } from 'vike/types'

async function onRenderClient(pageContext: PageContextClient) {
    console.log(pageContext.isHydration, pageContext.isClientSideNavigation)

    const { Page } = pageContext

    hydrateRoot(document.getElementById('root')!, <Page />)
}
