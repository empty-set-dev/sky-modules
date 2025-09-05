import SearchParamsContext from 'sky/platform/web/providers/SearchParamsContext'

export default function useSearchParameters(): [
    Record<string, string>,
    (query: Record<string, string>) => void,
] {
    const { query, setQuery } = useContext(SearchParamsContext)

    return [query, setQuery]
}
