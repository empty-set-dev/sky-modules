import React, { ReactNode, useContext } from 'react'

import type { PageContext } from 'vike/types'

const Context = React.createContext<PageContext>(undefined!)

export function PageContextProvider({
    pageContext,
    children,
}: {
    pageContext: PageContext
    children: ReactNode
}): ReactNode {
    return <Context.Provider value={pageContext}>{children}</Context.Provider>
}

export default function usePageContext(): PageContext {
    const pageContext = useContext(Context)
    return pageContext
}
