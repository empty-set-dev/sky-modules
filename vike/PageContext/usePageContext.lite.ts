import { useContext } from '@builder.io/mitosis'

import { PageContext } from './index.lite'

export default function usePageContext(): Vike.PageContext {
    return useContext(PageContext) as Vike.PageContext
}
