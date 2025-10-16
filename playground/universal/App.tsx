import '#setup'

import { ReactNode, useState } from 'react'

import { DesignSystemProvider } from '#/x/design/DesignSystem'

interface AppProps {
    screen: ReactNode
}
define('sky.playground.universal.App', App)
export default function App(props: AppProps): ReactNode {
    const { screen } = props
    const [theme] = useState<'light' | 'dark'>('light')
    const [palette] = useState('pink')

    return (
        <DesignSystemProvider brand="sky.playground" initialTheme={theme} initialPalette={palette}>
            {screen}
        </DesignSystemProvider>
    )
}
