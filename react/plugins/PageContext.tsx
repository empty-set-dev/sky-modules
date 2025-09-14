import { createContext } from 'react'
iAm('sky.react.plugins.PageContext', import('./PageContext'), {
    needs: ['sky.standard'],
})

declare global {
    interface Modules {
        'sky.react.plugins.PageContext': typeof import('./PageContext')
    }
}
namespace local {
    export const PageContext = createContext<null | Vike.PageContext>(null)
}

export function usePageContext(): Vike.PageContext {
    let pageContext: null | Vike.PageContext = useContext(local.PageContext)

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
    pageContext: Vike.PageContext
    children: ReactNode
}): ReactNode {
    return <local.PageContext.Provider value={pageContext}>{children}</local.PageContext.Provider>
}
