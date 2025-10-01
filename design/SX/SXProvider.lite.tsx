import { onMount, onUnMount, setContext, useStore } from '@builder.io/mitosis'

import SXContext from './SX.context.lite'

export interface SXProviderProps {
    children?: Mitosis.Children
    brand?: string
    initialTheme?: 'light' | 'dark'
    initialPalette?: string
}
export default function SXProvider(props: SXProviderProps): Mitosis.Node {
    const state = useStore({
        brand: props.brand,
        theme: props.initialTheme ?? 'light',
        palette: props.initialPalette,
        changeBrand(brand: string) {
            state.brand = brand
        },
        toggleTheme() {
            state.theme = state.theme === 'light' ? 'dark' : 'light'
        },
        changePalette(palette: string) {
            state.palette = palette
        },
    })
    onMount(() => {
        state.brand && document.body.setAttribute('data-brand', state.brand)

        state.palette
            ? state.palette && document.body.setAttribute('data-theme', state.palette)
            : state.theme && document.body.setAttribute('data-theme', state.theme)
    })
    onUnMount(() => {
        document.body.removeAttribute('brand')
        document.body.removeAttribute('theme')
    })
    setContext(SXContext, {
        brand: state.brand,
        theme: state.theme,
        palette: state.palette,
        changeBrand: state.changeBrand,
        toggleTheme: state.toggleTheme,
        changePalette: state.changePalette,
    })
    return <>{props.children}</>
}
