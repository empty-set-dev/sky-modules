import { PageContext } from 'vike/types'

import afterInitPage from '#/renderer/old/afterInitPage'
import initPage, { InitPageParameters, InitPageResult } from '#/renderer/old/initPage'
import type { PageDataResult } from '#/renderer/old/useData'
import type usePageContext from '#/renderer/old/usePageContext'

type DataResult<T> = ((pageContext: PageContext) => Promise<T>) & {
    init: (
        pageContext: ReturnType<typeof usePageContext> & {
            init(parameters: InitPageParameters): Promise<InitPageResult>
        }
    ) => Promise<T extends void ? PageDataResult<void> : PageDataResult<T>>
}

export default function data<T = void>(
    init: (
        pageContext: ReturnType<typeof usePageContext> & {
            init(parameters: InitPageParameters): Promise<InitPageResult>
        }
    ) => Promise<PageDataResult<T>>
): (pageContext: PageContext) => Promise<PageDataResult<T>> {
    const handler = (async (pageContext: PageContext): Promise<null | unknown> => {
        if (pageContext.isClientSideNavigation) {
            return null
        }

        ;(pageContext as { init: Function }).init = initPage
        const result = await init(pageContext as never)
        await afterInitPage.call(pageContext)

        pageContext.initial.title = result.title
        const data = (result as { data: unknown }).data
        delete (result as { data: unknown }).data
        Object.assign(pageContext, result)

        return data
    }) as DataResult<T>

    handler.init = init as never as DataResult<T>['init']

    return handler as (pageContext: PageContext) => Promise<PageDataResult<T>>
}
