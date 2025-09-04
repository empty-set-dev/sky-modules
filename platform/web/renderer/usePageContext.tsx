import { useContext } from 'react'
import Context from 'sky/platform/web/providers/PageContext'

import type { PageContext } from 'vike/types'

export default function usePageContext(): Omit<PageContext, 'init' | 'client' | 't' | 'initial'> {
    return useContext(Context)
}
