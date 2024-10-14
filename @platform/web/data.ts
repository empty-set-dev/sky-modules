import { QueryClient } from '@tanstack/react-query'
import { TFunction } from 'i18next'
import { PageContext } from 'vike/types'

import initPage from '#/renderer/initPage'

export interface InitParams {
    domain: string
    lng: string
    lngPrefix: string
    t: TFunction
    client: QueryClient
}
export interface InitResult {
    title: string
    description: string
    ogTitle?: string
    ogType?: string
    ogImage?: string
    preloads?: string[][]
    noIndex?: boolean
}
export default function data(
    init: (params: InitParams) => Promise<InitResult>,
    { ns }: { ns: string[] }
): (pageContext: PageContext) => Promise<null | PageContext['data']> {
    const handler = async (pageContext: PageContext): Promise<null | PageContext['data']> => {
        if (pageContext.isClientSideNavigation) {
            return null
        }

        const data = await initPage(pageContext, {
            ns,
        })

        const { title, description, ogTitle, ogType, ogImage, preloads, noIndex } = await init({
            domain: pageContext.domain,
            lng: pageContext.lng,
            lngPrefix: pageContext.lngPrefix,
            t: pageContext.t,
            client: pageContext.client,
        })

        return data
    }

    return handler
}
