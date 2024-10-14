import { DependencyList, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { InitPageParams, InitPageResult } from './initPage'
import { usePageContext } from './usePageContext'

export default function useData<Data>(
    handler: {
        init: (params: InitPageParams) => Promise<InitPageResult<Data>>
    },
    deps?: DependencyList
): {
    isLoading: boolean
    title?: string
} & Partial<Data> {
    const pageContext = usePageContext()

    const [isLoading, setLoading] = useState(true)
    const [data, setData] = useState<
        {
            title: string
        } & Data
    >()

    const { t } = useTranslation()

    useEffect(() => {
        if (afterHydration) {
            return
        }

        load()

        async function load(): Promise<void> {
            const client = await import('./+onRenderClient')

            const { title, data } = await handler.init({
                client: client.client,
                domain: pageContext.data.domain,
                lng: pageContext.data.lng,
                lngPrefix: pageContext.data.lngPrefix,
                t,
                store: client.store,
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

export function useDomain(): string {
    const pageContext = usePageContext()
    return pageContext.data.domain
}

export function useLng(): {
    lng: string
    lngPrefix: string
} {
    const pageContext = usePageContext()
    return {
        lng: pageContext.data.lng,
        lngPrefix: pageContext.data.lngPrefix,
    }
}

export function useIp(): string {
    const pageContext = usePageContext()
    return pageContext.data.ip
}

export function useUrlLogical(): string {
    const pageContext = usePageContext()
    return pageContext.data.urlLogical
}
