import '#/imports'
import '../../.dev/styled-system/styles.css'

import { ReactNode, useState } from 'react'

import { Box } from '../../.dev/styled-system/jsx'

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
                <LayoutRoot variant="landing" fullHeight="viewport">
                    <Box bg="blue.300" p="20" mx="auto" maxW="4xl" borderRadius="lg">
                        <Box>ARCH: {ARCH}</Box>
                        <Box>PLATFORM: {PLATFORM}</Box>
                        <Box>OS: {OS}</Box>
                        <Box>APP_PLATFORM_TARGET: {APP_PLATFORM_TARGET}</Box>
                    </Box>
                </LayoutRoot>
            </SXProvider>
        )
    }
}
