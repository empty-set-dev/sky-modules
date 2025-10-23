import { useContext } from '@builder.io/mitosis'

import PageContext from './Page.context.lite'

export default function usePageContext(): Vike.PageContext {
    return useContext(PageContext) as Vike.PageContext
}
