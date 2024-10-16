import { DependencyList, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageContext } from 'vike/types'

import { InitPageParams, InitPageResult } from './initPage'
import usePageContext from './usePageContext'

export default function useData<Data>(
    handler: {
        init: (
            params: InitPageParams
        ) => Promise<Data extends unknown ? InitPageResult<undefined> : InitPageResult<Data>>
    },
    deps?: DependencyList
): {
    isLoading: boolean
} & Partial<Data> {
    const pageContext = usePageContext() as PageContext

    const [isLoading, setLoading] = useState(!afterHydration)
    const [data, setData] = useState<null | Data>(
        afterHydration ? (pageContext.data! as Data) : null
    )

    const { t } = useTranslation()

    useEffect(() => {
        if (afterHydration) {
            return
        }

        load()

        async function load(): Promise<void> {
            const client = (await import('./client')).default

            const result = await handler.init({
                client: client,
                domain: pageContext.domain,
                lng: pageContext.lng,
                lngPrefix: pageContext.lngPrefix,
                t,
                store: pageContext.initial.store,
            })

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

export function useIp(): string {
    const pageContext = usePageContext() as PageContext
    return pageContext.initial.ip
}
