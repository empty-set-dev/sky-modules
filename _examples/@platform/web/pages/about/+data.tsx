import { PageContext } from 'vike/types'

import initPage from '#/renderer/initPage'

export async function data(pageContext: PageContext): Promise<null | PageContext['data']> {
    if (pageContext.isClientSideNavigation) {
        return null
    }

    const data = await initPage(pageContext, {
        ns: [],
    })

    pageContext.title = 'About'
    pageContext.description = ''

    return data
}
