import { HydrationBoundary, QueryClient, QueryClientProvider } from 'pkgs/@tanstack/react-query'
import { PropsWithChildren, ReactNode, useEffect } from 'react'
import { PageContextProvider } from 'sky/platform/web/contexts/PageContext'
import { SearchParamsProvider } from 'sky/platform/web/contexts/SearchParamsContext'
import StoreContext from 'sky/platform/web/contexts/StoreContext'
import { logConsole } from 'sky/utilities/console'
import { MediaContextProvider } from 'sky/platform/web/contexts/MediaContext'

import TranslationsProvider from '#/renderer/TranslationsProvider'

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
                            <SearchParamsProvider>
                                <MediaContextProvider>
                                    {children}
                                </MediaContextProvider>
                            </SearchParamsProvider>
                        </HydrationBoundary>
                    </QueryClientProvider>
                </TranslationsProvider>
            </StoreContext.Provider>
        </PageContextProvider>
    )
}
