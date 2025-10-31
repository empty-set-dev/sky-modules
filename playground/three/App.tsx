import '#/setup'

import { ReactNode, useState } from 'react'

import { DesignSystemProvider } from '#/x/design/DesignSystem'

interface AppProps {
    screen: ReactNode
}
define('sky.playground.three.App', App)
export default function App(props: AppProps): ReactNode {
    const { screen } = props
    const [theme] = useState<'light' | 'dark' | 'auto'>('light')
    const [palette] = useState('pink')

    return (
        <DesignSystemProvider brand="sky.playground" initialTheme={theme} initialPalette={palette}>
            {screen}
        </DesignSystemProvider>
    )
}
