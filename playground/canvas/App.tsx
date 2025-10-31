import { JSX, createSignal } from 'sky-jsx'

import { DesignSystemProvider } from '#/x/design/DesignSystem'

interface AppProps {
    screen: JSX.Element
}
define('sky.playground.Canvas.App', App)
export default function App(props: AppProps): JSX.Element {
    const { screen } = props
    const [theme] = createSignal<'light' | 'dark' | 'auto'>('light')
    const [palette] = createSignal('pink')

    return (
        <DesignSystemProvider
            brand="sky.playground"
            initialTheme={theme()}
            initialPalette={palette()}
        >
            {screen}
        </DesignSystemProvider>
    )
}
