import SearchParamsContext from '@sky-modules/react/providers/SearchParamsContext'

export default function useSearchParameters(): [
    Record<string, string>,
    (query: Record<string, string>) => void,
] {
    const { query, setQuery } = useContext(SearchParamsContext)

    return [query, setQuery]
}
