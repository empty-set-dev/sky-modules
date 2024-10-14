// https://vike.dev/usePageContext
export { usePageContext }
import React, { useContext } from 'react'

import type { PageContext } from 'vike/types'

const Context = React.createContext<PageContext>(undefined as unknown as PageContext)

export function PageContextProvider({
    pageContext,
    children,
}: {
    pageContext: PageContext
    children: React.ReactNode
}): ReactNode {
    console.log('-->', !!pageContext)
    return <Context.Provider value={pageContext}>{children}</Context.Provider>
}

/** https://vike.dev/usePageContext */
function usePageContext(): PageContext {
    const pageContext = useContext(Context)
    console.log('!!!', !!pageContext)
    return pageContext
}
