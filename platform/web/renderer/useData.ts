import { DependencyList, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageContext } from 'vike/types'

import type { InitPageParameters, InitPageResult } from '#/renderer/initPage'
import usePageContext from '#/renderer/usePageContext'

interface PageDataResultBase {
    title: string
    description: string
    ogTitle?: string
    ogType?: string
    ogImage?: string
    preloads?: string[][]
    noIndex?: boolean
}
export type PageDataResult<T = void> = T extends void
    ? PageDataResultBase
    : PageDataResultBase & {
          data: T
      }

export default function useData<Data>(
    handler: {
        init: (
            pageContext: ReturnType<typeof usePageContext> & {
                init(parameters: InitPageParameters): Promise<InitPageResult>
            }
        ) => Promise<Data extends unknown ? PageDataResult<void> : PageDataResult<Data>>
    },
    deps?: DependencyList
): {
    isLoading: boolean
} & Partial<Data> {
    const pageContext = usePageContext() as PageContext

    const [isLoading, setLoading] = useState(!afterHydration)
    const [data, setData] = useState<undefined | Data>(
        afterHydration ? (pageContext.data! as Data) : undefined
    )

    const { t } = useTranslation()

    useEffect(() => {
        if (afterHydration) {
            return
        }

        async(load)

        async function load(): Promise<void> {
            pageContext.init = async (): Promise<InitPageResult> => ({
                domain: pageContext.domain,
                lng: pageContext.lng,
                lngPrefix: pageContext.lngPrefix,
                t,
                queryClient: (await import('#/renderer/queryClient')).default,
                ip: pageContext.initial.ip,
            })

            const result = await handler.init(pageContext)

            if ((result as { data: unknown }).data) {
                setData((result as { data: unknown }).data as Data)
            }

            document.title = result.title

            setLoading(false)
        }
    }, deps ?? [])

    return {
        isLoading,
        ...data,
    } as {
        isLoading: boolean
    } & Partial<Data>
}
