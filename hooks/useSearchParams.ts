import { SearchParamsContext } from 'sky/providers/SearchParamsProvider'

export default function useSearchParams(): [
    Record<string, string>,
    (query: Record<string, string>) => void,
] {
    const { query, setQuery } = useContext(SearchParamsContext)

    return [query, setQuery]
}
