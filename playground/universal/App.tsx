import '#setup'

import { ReactNode, useState } from 'react'

import { SXProvider } from '#/x/design/SX'

interface AppProps {
    screen: ReactNode
}
define('sky.playground.universal.App', App)
export default function App(props: AppProps): ReactNode {
    const { screen } = props
    const [theme] = useState<'light' | 'dark'>('light')
    const [palette] = useState('pink')

    return (
        <SXProvider brand="sky.playground" initialTheme={theme} initialPalette={palette}>
            {screen}
        </SXProvider>
    )
}
