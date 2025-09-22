import { useContext } from 'react'
import local from './__local'

// Commented out iAm call as it's not available in Vike config context
// iAm('sky.react.PageContext', import('./PageContext'))

declare global {
    interface Modules {
        'sky.react.PageContext': typeof import('./PageContext')
    }
}

export function usePageContext(): Vike.PageContext {
    const pageContext = useContext(local.PageContext)
    if (!pageContext) {
        throw new Error('usePageContext must be used within PageContextProvider')
    }
    return pageContext
}

export default function PageContextProvider({
    pageContext,
    children,
}: {
    pageContext: Vike.PageContext
    children: ReactNode
}): ReactNode {
    return <local.PageContext.Provider value={pageContext}>{children}</local.PageContext.Provider>
}
