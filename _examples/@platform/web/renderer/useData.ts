import { DependencyList, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageContext } from 'vike/types'

import { InitPageParams, InitPageResult } from './initPage'
import usePageContext from './usePageContext'

export default function useData<Data>(
    handler: {
        init: (params: InitPageParams) => Promise<InitPageResult<Data>>
    },
    deps?: DependencyList
): {
    isLoading: boolean
    title?: string
} & Partial<Data> {
    const pageContext = usePageContext() as PageContext

    const [isLoading, setLoading] = useState(!afterHydration)
    const [data, setData] = useState<
        | null
        | ({
              title: string
          } & Data)
    >(
        afterHydration
            ? ({
                  title: pageContext.initial.title,
                  ...pageContext.data!,
              } as {
                  title: string
              } & Data)
            : null
    )

    const { t } = useTranslation()

    useEffect(() => {
        if (afterHydration) {
            return
        }

        load()

        async function load(): Promise<void> {
            const client = (await import('./client')).default

            const { title, data } = await handler.init({
                client: client,
                domain: pageContext.domain,
                lng: pageContext.lng,
                lngPrefix: pageContext.lngPrefix,
                t,
                store: pageContext.initial.store,
            })

            setData({ title, ...data })

            setLoading(false)
        }
    }, deps ?? [])

    return {
        isLoading,
        ...data,
    } as {
        isLoading: boolean
        title?: string
    } & Partial<Data>
}

export function useIp(): string {
    const pageContext = usePageContext() as PageContext
    return pageContext.initial.ip
}
