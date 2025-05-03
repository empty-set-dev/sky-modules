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
    const search = pageContext.urlParsed.search
    const [query, setQueryState] = useState(search)

    function setQuery(query: Record<string, string>): void {
        const keys = Object.keys(query)

        if (keys.length === 0) {
            history.pushState(null, '', `/${location.pathname}`)
        } else {
            history.pushState(
                null,
                '',
                `/${location.pathname}?${keys.map(k => `${k}=${query[k]}`).join('&')}`
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
