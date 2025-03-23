import type { PageContext } from 'vike/types'

const Context = React.createContext<PageContext>(undefined!)

export default Context

export function PageContextProvider({
    pageContext,
    children,
}: {
    pageContext: PageContext
    children: ReactNode
}): ReactNode {
    return <Context.Provider value={pageContext}>{children}</Context.Provider>
}
