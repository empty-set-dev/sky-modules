import '#/imports'

import { ReactNode, useState } from 'react'

import ColorPicker from './canvas/ColorPicker'
import Canvas from './mitosis/Canvas/Canvas'
import { SXProvider } from './mitosis/design/SX'
import Button from './mitosis/universal/Button'
import { LayoutRoot } from './mitosis/universal/Layout'
import Popover, { usePopover } from './mitosis/universal/Popover'

@define('sky.playground.universal.App')
export default class App {
    @bind
    render = function App(this: App): ReactNode {
        const [theme] = useState<'light' | 'dark'>('light')
        const [palette] = useState('pink')

        const popover = usePopover({
            placement: 'top',
            withArrow: true,
            offsetValue: 0,
        })

        return (
            <SXProvider
                brand="universal-example-brand"
                initialTheme={theme}
                initialPalette={palette}
            >
                <LayoutRoot variant="landing" fullHeight="viewport">
                    <PlatformVariables />
                    <Popover this={popover} trigger={<Button>Color Picker</Button>}>
                        <Canvas>
                            <ColorPicker />
                        </Canvas>
                    </Popover>
                </LayoutRoot>
            </SXProvider>
        )
    }
}

function PlatformVariables(): ReactNode {
    return (
        <Box p="4" bg="yellow.500">
            <Box>ARCH: {ARCH}</Box>
            <Box>PLATFORM: {PLATFORM}</Box>
            <Box>OS: {OS}</Box>
            <Box>APP_PLATFORM_TARGET: {APP_PLATFORM_TARGET}</Box>
        </Box>
    )
}
