import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren, ReactNode, useEffect } from 'react'
import { logConsole } from 'sky/helpers/console'
import TranslationsProvider from 'sky/i18n/TranslationsProvider'

import StoreContext from './StoreContext'
import { PageContextProvider } from './usePageContext'

import type { PageContext } from 'vike/types'

import '#/styles/initial/index.scss'

export interface PageProvidersProps extends PropsWithChildren {
    pageContext: PageContext
    client: QueryClient
}
export default function PageProviders(props: PageProvidersProps): ReactNode {
    const {
        pageContext,
        client,
        pageContext: {
            lng,
            initial: { store, ns, resources },
        },
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
                    <QueryClientProvider client={client}>{children}</QueryClientProvider>
                </TranslationsProvider>
            </StoreContext.Provider>
        </PageContextProvider>
    )
}
