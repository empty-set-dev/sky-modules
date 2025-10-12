import '#/imports'

import { ReactNode, useState } from 'react'

import Canvas from '#/x/Canvas/Canvas'
import { SXProvider } from '#/x/design/SX'
import Button from '#/x/universal/Button'
import { LayoutRoot } from '#/x/universal/Layout'
import Popover, { usePopover } from '#/x/universal/Popover'

import ColorPicker, { useColorPicker } from './canvas/ColorPicker/ColorPicker'

define('sky.playground.universal.App', App)
function App(): ReactNode {
    const [theme] = useState<'light' | 'dark'>('light')
    const [palette] = useState('pink')

    const colorPicker = useColorPicker()

    const popover = usePopover({
        placement: 'top',
        withArrow: true,
        offsetValue: 0,
    })

    return (
        <SXProvider brand="universal-example-brand" initialTheme={theme} initialPalette={palette}>
            <LayoutRoot variant="landing" fullHeight="viewport">
                <PlatformVariables />
                <Popover controller={popover} trigger={<Button>Color Picker</Button>}>
                    <Canvas>
                        <ColorPicker controller={colorPicker} />
                    </Canvas>
                </Popover>
            </LayoutRoot>
        </SXProvider>
    )
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
