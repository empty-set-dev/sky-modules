import { createContext } from 'react'

import type { PageContext as VikePageContext } from 'vike/types'

export const PageContext = createContext<null | VikePageContext>(null)

export function usePageContext(): Vike.PageContext {
    const pageContext = useContext(PageContext)

    if (pageContext == null) {
        throw new Error(
            'PageContext is null or undefined.\n' +
                'This may occur when:\n' +
                '1. Component is not wrapped in PageContext.Provider\n' +
                '2. PageContext was not passed as a prop\n' +
                '3. Context initialization failed'
        )
    }

    return pageContext
}

export default function PageContextProvider({
    pageContext,
    children,
}: {
    pageContext: VikePageContext
    children: ReactNode
}): ReactNode {
    return <PageContext.Provider value={pageContext}>{children}</PageContext.Provider>
}
