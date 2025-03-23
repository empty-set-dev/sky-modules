import { useContext } from 'react'
import Context from 'sky/platform/web/contexts/PageContext'

import type { PageContext } from 'vike/types'

export default function usePageContext(): Omit<
    PageContext,
    | 'init'
    | 'title'
    | 'description'
    | 'ogTitle'
    | 'ogType'
    | 'ogImage'
    | 'preloads'
    | 'noIndex'
    | 'client'
    | 't'
    | 'initial'
> {
    return useContext(Context)
}
