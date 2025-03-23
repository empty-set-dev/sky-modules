import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren, ReactNode, useEffect } from 'react'
import { logConsole } from 'sky/utilities/console'
import SearchParamsProvider from 'sky/platform/web/contexts/SearchParamsContext'

import StoreContext from './StoreContext'
import TranslationsProvider from './TranslationsProvider'
import { PageContextProvider } from './usePageContext'

import type { PageContext } from 'vike/types'

export interface PageProvidersProps extends PropsWithChildren {
    pageContext: PageContext
    queryClient: QueryClient
}
export default function PageProviders(props: PageProvidersProps): ReactNode {
    const {
        pageContext,
        pageContext: {
            lng,
            initial: { store, ns, resources, dehydratedState },
        },
        queryClient,
        children,
    } = props

    logConsole('Page Render', pageContext.urlOriginal)

    useEffect(() => {
        setTimeout(() => {
            global.afterHydration = false
        }, 0)
    }, [])

    return (
        <PageContextProvider pageContext={pageContext}>
            <StoreContext.Provider value={store}>
                <TranslationsProvider lng={lng} ns={ns} resources={resources}>
                    <QueryClientProvider client={queryClient}>
                        <HydrationBoundary state={dehydratedState} queryClient={queryClient}>
                            <SearchParamsProvider>{children}</SearchParamsProvider>
                        </HydrationBoundary>
                    </QueryClientProvider>
                </TranslationsProvider>
            </StoreContext.Provider>
        </PageContextProvider>
    )
}
