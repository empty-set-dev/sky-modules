import { setContext, useContext, useStore } from '@builder.io/mitosis'

import SXContext from './SX.context.lite'
import { SXContextType } from './types.lite'

export interface SXProviderProps {
    children?: Mitosis.Children
    initialMode?: 'light' | 'dark'
}
export default function SXProvider(props: SXProviderProps): Mitosis.Node {
    const { children, initialMode } = props
    const state = useStore({
        mode: initialMode ?? 'light',
        toggleMode() {
            state.mode = state.mode === 'light' ? 'dark' : 'light'
        },
    })
    setContext(SXContext, state)
    return children
}

export function useSXContext(): SXContextType {
    return useContext(SXContext)
}
