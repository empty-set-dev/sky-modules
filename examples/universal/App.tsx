import '#/imports'
import '@sky-modules/design/Box.global'
import '@sky-modules/design/Design.namespace'

import { ReactNode, useState } from 'react'

import { SXProvider } from './mitosis/design/SX'
import { LayoutRoot } from './mitosis/universal/Layout'

@define('sky.examples.universal.App')
export default class App {
    @bind
    render = function App(this: App): ReactNode {
        const [theme] = useState<'light' | 'dark'>('light')
        const [palette] = useState('pink')

        return (
            <SXProvider
                brand="universal-example-brand"
                initialTheme={theme}
                initialPalette={palette}
            >
                <LayoutRoot variant="landing" fullHeight="viewport"></LayoutRoot>
            </SXProvider>
        )
    }
}
