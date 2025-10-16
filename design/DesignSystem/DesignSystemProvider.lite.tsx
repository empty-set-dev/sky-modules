import { onMount, onUnMount, setContext, useStore } from '@builder.io/mitosis'

import DesignSystemContext from './DesignSystem.context.lite'

export interface DesignSystemProviderProps {
    children?: Mitosis.Children
    brand?: string
    initialTheme?: 'light' | 'dark' | 'auto'
    initialPalette?: string
}
export default function DesignSystemProvider(props: DesignSystemProviderProps): Mitosis.Node {
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
        state.theme && document.body.setAttribute('data-theme', state.theme)
        state.palette && document.body.setAttribute('data-palette', state.palette)
    })
    onUnMount(() => {
        document.body.removeAttribute('brand')
        document.body.removeAttribute('theme')
        document.body.removeAttribute('palette')
    })
    setContext(DesignSystemContext, {
        brand: state.brand,
        theme: state.theme,
        palette: state.palette,
        changeBrand: state.changeBrand,
        toggleTheme: state.toggleTheme,
        changePalette: state.changePalette,
    })
    return <>{props.children}</>
}
