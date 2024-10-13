import { PageContext } from 'vike/types'

import initPage from '#/renderer/initPage'

export default async function data(pageContext: PageContext): Promise<null | PageContext['data']> {
    if (pageContext.isClientSideNavigation) {
        return null
    }

    const data = await initPage(pageContext, {
        ns: [],
    })

    const t = (await import(`#/locales/${pageContext.lng}/common.js`)).default

    pageContext.title = t.title
    pageContext.description = ''

    return data
}
