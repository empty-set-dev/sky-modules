import { PageContext } from 'vike/types'

import initPage, { InitPageParams, InitPageResult } from '#/renderer/initPage'

type DataResult<T> = ((pageContext: PageContext) => Promise<null | unknown>) & {
    init: (
        params: InitPageParams
    ) => Promise<T extends unknown ? InitPageResult<undefined> : InitPageResult<T>>
}

export default function data<T>(
    init: (
        params: InitPageParams
    ) => Promise<T extends unknown ? InitPageResult<undefined> : InitPageResult<T>>,
    { ns }: { ns: string[] }
): DataResult<T> {
    const handler = (async (pageContext: PageContext): Promise<null | unknown> => {
        if (pageContext.isClientSideNavigation) {
            return null
        }

        await initPage(pageContext, {
            ns,
        })

        const result = await init({
            domain: pageContext.domain,
            lng: pageContext.lng,
            lngPrefix: pageContext.lngPrefix,
            t: pageContext.t,
            client: pageContext.client,
            store: pageContext.initial.store,
        })

        pageContext.initial.title = result.title
        const data = (result as { data: unknown }).data
        delete (result as { data: unknown }).data
        Object.assign(pageContext, result)

        return data
    }) as DataResult<T>

    handler.init = init

    return handler
}
