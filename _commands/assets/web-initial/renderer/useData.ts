// https://vike.dev/useData
export { useData }

import { PageContext } from 'vike/types'

import { usePageContext } from './usePageContext'

/** https://vike.dev/useData */
function useData<Data>(): PageContext['data'] & Data {
    const { data } = usePageContext()
    return data as PageContext['data'] & Data
}
