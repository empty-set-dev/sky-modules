import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { PropsWithChildren, ReactNode } from 'react'
import { logConsole } from 'sky/helpers/console'

import Store from '../Store'

import StoreContext from './StoreContext'
import TranslationsProvider from './TranslationsProvider'
import { PageContextProvider } from './usePageContext'

import type { PageContext } from 'vike/types'

import '#/styles/initial/index.scss'

export interface PageContextsProvidesProps extends PropsWithChildren {
    pageContext: PageContext
    store: Store
    client: QueryClient
}
export default function PageContextsProviders(props: PageContextsProvidesProps): ReactNode {
    const {
        pageContext,
        store,
        client,
        pageContext: {
            data: { lng, ns, resources },
        },
        children,
    } = props

    logConsole('Page Render', pageContext.urlOriginal)

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
