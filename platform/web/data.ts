import { PageContext } from 'vike/types'

import afterInitPage from '#/renderer/afterInitPage'
import initPage, { InitPageOptions, InitPageResult } from '#/renderer/initPage'
import type { PageDataResult } from '#/renderer/useData'
import type usePageContext from '#/renderer/usePageContext'

type DataResult<T> = ((pageContext: PageContext) => Promise<T>) & {
    init: (
        pageContext: ReturnType<typeof usePageContext> & {
            init(options: InitPageOptions): Promise<InitPageResult>
        }
    ) => Promise<T extends void ? PageDataResult<void> : PageDataResult<T>>
}

export default function data<T>(
    init: (
        pageContext: ReturnType<typeof usePageContext> & {
            init(options: InitPageOptions): Promise<InitPageResult>
        }
    ) => Promise<T extends unknown ? PageDataResult<void> : PageDataResult<T>>
): DataResult<T> {
    const handler = (async (pageContext: PageContext): Promise<null | unknown> => {
        if (pageContext.isClientSideNavigation) {
            return null
        }

        pageContext.init = initPage
        const result = await init(pageContext)
        await afterInitPage.call(pageContext)

        pageContext.initial.title = result.title
        const data = (result as { data: unknown }).data
        delete (result as { data: unknown }).data
        Object.assign(pageContext, result)

        return data
    }) as DataResult<T>

    handler.init = init as unknown as DataResult<T>['init']

    return handler
}
