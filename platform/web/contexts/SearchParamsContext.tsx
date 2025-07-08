import { createContext } from 'react'
import usePageContext from 'sky/platform/web/renderer/usePageContext'

const SearchParamsContext = createContext(
    {} as {
        query: Record<string, string>
        setQuery: (query: Record<string, string>) => void
    }
)

export default SearchParamsContext

export function SearchParamsContextProvider(props: PropsWithChildren): ReactNode {
    const pageContext = usePageContext()
    let search: Record<string, string> = {}
    const [query, setQueryState] = useState(search)

    for (const param of new URLSearchParams(pageContext.urlOriginal.split('?')[1])) {
        search[param[0]] = param[1]
    }

    function setQuery(query: Record<string, string>): void {
        const keys = Object.keys(query).filter(k => query[k] != null)

        if (keys.length === 0) {
            history.pushState(null, '', `/${location.pathname}`)
        } else {
            history.pushState(
                null,
                '',
                `${location.origin}${location.pathname}?${keys.map(k => `${k}=${query[k]}`).join('&')}`
            )
        }

        setQueryState(query)
    }

    return (
        <SearchParamsContext.Provider value={{ query, setQuery }}>
            {props.children}
        </SearchParamsContext.Provider>
    )
}
