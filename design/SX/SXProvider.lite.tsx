import { setContext, useStore } from '@builder.io/mitosis'

import Brand from '../Brand'

import SXContext from './SX.context.lite'

export interface SXProviderProps {
    children?: Mitosis.Children
    brand?: string
    brands: Record<string, Brand>
    initialMode?: 'light' | 'dark'
    initialPalette?: string
}
export default function SXProvider(props: SXProviderProps): Mitosis.Node {
    const state = useStore({
        brands: props.brands,
        brand: props.brand,
        mode: props.initialMode ?? 'light',
        palette: props.initialPalette,
        changeBrand(brand: string) {
            state.brand = brand
        },
        toggleMode() {
            state.mode = state.mode === 'light' ? 'dark' : 'light'
        },
        changePalette(palette: string) {
            state.palette = palette
        },
    })
    setContext(SXContext, {
        brand: state.brand,
        mode: state.mode,
        palette: state.palette,
    })
    return <>{props.children}</>
}
