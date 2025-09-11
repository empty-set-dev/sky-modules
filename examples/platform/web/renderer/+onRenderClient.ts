export { onRenderClient }


import type { PageContextClient } from 'vike/types'

async function onRenderClient(pageContext: PageContextClient) {
    console.log(pageContext.isHydration, pageContext.isClientSideNavigation)
}
