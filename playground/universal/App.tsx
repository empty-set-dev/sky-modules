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

define('sky.playground.universal.App', App)
export default function App(): ReactNode {
    const [theme] = useState<'light' | 'dark'>('light')
    const [palette] = useState('pink')

    const [colorPicker, setColorPicker] = useController<ColorPickerController>()

    const popover = usePopover({
        placement: 'top',
        offsetValue: 0,
        withArrow: false,
    })

    return (
        <SXProvider brand="universal-example-brand" initialTheme={theme} initialPalette={palette}>
            <LayoutRoot variant="landing" fullHeight="viewport">
                <PlatformVariables />
                <div
                    className="text-red-400"
                    style={{
                        width: 40,
                        height: 40,
                        backgroundColor: colorPicker?.selectedColor ?? 'transparent',
                    }}
                ></div>
                <Popover controller={popover} trigger={<Button>Color Picker</Button>}>
                    <Canvas>
                        <ColorPicker
                            currentController={colorPicker}
                            onControllerReady={setColorPicker}
                        />
                    </Canvas>
                </Popover>
            </LayoutRoot>
        </SXProvider>
    )
}

function PlatformVariables(): ReactNode {
    return (
        <div className="bg-co">
            <div>Arch: {ARCH}</div>
            <div>Platform: {PLATFORM}</div>
            <div>Operation System: {OS}</div>
            <div>App Platform Target: {APP_PLATFORM_TARGET}</div>
        </div>
    )
}
