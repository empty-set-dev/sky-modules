import afterInitPage from 'pkgs/@artsy/fresnel/renderer/afterInitPage'
import { PageContext } from 'vike/types'

import initPage, {
    InitPageOptions,
    InitPageResult,
} from '../../_examples/pkgs/@artsy/fresnel/renderer/initPage'

import type { PageDataResult } from '../../_examples/pkgs/@artsy/fresnel/renderer/useData'
import type usePageContext from '../../_examples/pkgs/@artsy/fresnel/renderer/usePageContext'

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
