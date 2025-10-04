import '#/imports'
import '../../.dev/styled-system/styles.css'

import { recipe } from '@sky-modules/design/recipe'
import ColorPicker from '@sky-modules/react/widgets/ColorPicker'
import { ReactNode, useState } from 'react'

import { SXProvider } from './mitosis/design/SX'
// import Container from './mitosis/universal/Container'
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
                    <PlatformVariables />
                    <ColorPicker />
                </LayoutRoot>
            </SXProvider>
        )
    }
}

function PlatformVariables(): ReactNode {
    return (
        <Box p="4" sx={platformVariablesRecipe()} className="bg-red-500">
            <Box>ARCH: {ARCH}</Box>
            <Box>PLATFORM: {PLATFORM}</Box>
            <Box>OS: {OS}</Box>
            <Box>APP_PLATFORM_TARGET: {APP_PLATFORM_TARGET}</Box>
        </Box>
    )
}

const platformVariablesRecipe = recipe({
    base: `
        bg-red-500
    `,
})
