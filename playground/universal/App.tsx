import '#/setup'

import { ReactNode, useState } from 'react'

import Canvas from '#/x/Canvas/Canvas'
import { SXProvider } from '#/x/design/SX'
import Button from '#/x/universal/Button'
import { LayoutRoot } from '#/x/universal/Layout'
import Popover, { usePopover } from '#/x/universal/Popover'

import ColorPicker from './canvas/ColorPicker/ColorPicker'
import ColorPickerController from './canvas/ColorPicker/ColorPickerController'
import useController from './x/jsx/useController'
import Container from './x/universal/Container'

define('sky.playground.universal.App', App)
export default function App(): ReactNode {
    const [theme] = useState<'light' | 'dark'>('light')
    const [palette] = useState('pink')

    return (
        <SXProvider brand="universal-example-brand" initialTheme={theme} initialPalette={palette}>
            <LayoutRoot variant="landing" fullHeight="viewport">
                <PlatformVariables />
                <ColorPickerContainer />
            </LayoutRoot>
        </SXProvider>
    )
}

function PlatformVariables(): ReactNode {
    return (
        <Container sx="bg-emerald-950 mx-auto p-4 rounded-xl">
            <div>Arch: {ARCH}</div>
            <div>Platform: {PLATFORM}</div>
            <div>Operation System: {OS}</div>
            <div>App Platform Target: {APP_PLATFORM_TARGET}</div>
        </Container>
    )
}

function ColorPickerContainer(): ReactNode {
    const [colorPicker, setColorPicker] = useController<ColorPickerController>()

    const popover = usePopover({
        placement: 'top',
        offsetValue: 0,
        withArrow: false,
    })

    return (
        <Container mt={10} sx="bg-emerald-950 mx-auto p-4 rounded-xl">
            <Popover controller={popover} trigger={<Button>Color Picker</Button>}>
                <Canvas>
                    <ColorPicker
                        currentController={colorPicker}
                        onControllerReady={setColorPicker}
                    />
                </Canvas>
            </Popover>
        </Container>
    )
}
