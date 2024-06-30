import '@/styles/initial/index.scss'

import React from 'react'

import { PageContextProvider } from './usePageContext'

import type { PageContext } from 'vike/types'

export function PageLayout({
    children,
    pageContext,
}: {
    children: React.ReactNode
    pageContext: PageContext
}): ReactNode {
    return (
        <React.StrictMode>
            <PageContextProvider pageContext={pageContext}>{children}</PageContextProvider>
        </React.StrictMode>
    )
}
