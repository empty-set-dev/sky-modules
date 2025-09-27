import local from 'sky/react/__local'

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
