import { setContext } from '@builder.io/mitosis'
import Mitosis from '@sky-modules/universal/Mitosis'

import PageContext from './Page.context.lite'

export interface PageContextProviderProps {
    children?: Mitosis.Children
    value: Vike.PageContext
}

export default function PageContextProvider(props: PageContextProviderProps): Mitosis.Node {
    setContext(PageContext, props.value)
    return <>{props.children}</>
}
