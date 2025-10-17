import { ReactNode } from 'react'

import ColorPicker from '#/canvas/ColorPicker'
import ColorPickerController from '#/canvas/ColorPicker/ColorPickerController'
import ScreenLayout from '#/layouts/screen'
import Canvas from '#/x/Canvas/Canvas'
import useController from '#/x/jsx/useController'
import Button from '#/x/universal/buttons/Button'
import AspectRatio from '#/x/universal/layout/AspectRatio'
import Container from '#/x/universal/layout/Container'
import Popover, { usePopover } from '#/x/universal/Popover'

export default function TestScreen(): ReactNode {
    return (
        <ScreenLayout>
            <PlatformVariables />
            <ColorPickerContainer />
            <AspectRatio aspectRatio={1 / 2} sx="bg-amber-300" w={100}></AspectRatio>
        </ScreenLayout>
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
