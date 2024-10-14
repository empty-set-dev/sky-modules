import { PageContext } from 'vike/types'

import initPage, { InitPageParams, InitPageResult } from '#/renderer/initPage'

type DataResult = ((pageContext: PageContext) => Promise<null | PageContext['data']>) & {
    init: (params: InitPageParams) => Promise<InitPageResult>
}

export default function data(
    init: (params: InitPageParams) => Promise<InitPageResult>,
    { ns }: { ns: string[] }
): DataResult {
    const handler = (async (pageContext: PageContext): Promise<null | PageContext['data']> => {
        if (pageContext.isClientSideNavigation) {
            return null
        }

        const data = await initPage(pageContext, {
            ns,
        })

        const result = await init({
            domain: pageContext.domain,
            lng: pageContext.lng,
            lngPrefix: pageContext.lngPrefix,
            t: pageContext.t,
            client: pageContext.client,
        })

        Object.assign(pageContext, result)

        return data
    }) as DataResult

    handler.init = init

    return handler
}
