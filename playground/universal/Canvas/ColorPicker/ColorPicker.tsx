import { animate } from '@sky-modules/behavior/motion'
import { CircleGeometry, BasicMaterial } from '@sky-modules/canvas/jsx'
import { useCanvas } from '@sky-modules/canvas/jsx'
import { Mesh, StrokeGradientMaterial } from '@sky-modules/Canvas/jsx'
import MeshClass from '@sky-modules/Canvas/Mesh'
import { assertIsNotUndefined } from '@sky-modules/core'
import Vector2 from '@sky-modules/math/Vector2'
import { formatHex } from 'culori'
import JSX, { createEffect, createSignal, onCleanup, onMount } from 'sky-jsx'

import ColorPickerController from './ColorPickerController'

function useColorPicker(currentController: ColorPickerController | null): ColorPickerController {
    const [getSelectedColor, setSelectedColor] = createSignal<string | null>(
        currentController?.selectedColor ?? null
    )
    const [controller] = createSignal(
        new ColorPickerController({ getSelectedColor, setSelectedColor })
    )
    return controller()
}

export interface ColorPickerProps {
    currentController: ColorPickerController | null
    onControllerReady: (controller: ColorPickerController) => void
}
export default function ColorPicker({
    currentController,
    onControllerReady,
}: ColorPickerProps): JSX.Return {
    const controller = useColorPicker(currentController)
    onControllerReady(controller)
    const canvas = useCanvas()
    let circleRef: MeshClass
    let indicatorRef: MeshClass
    const gradient = canvas.drawContext.createConicGradient(0, 0, 0)

    const [animatedHue, setAnimatedHue] = createSignal(0)
    let animationControls: { stop(): void } | null = null

    const animateToTarget = (target: number): void => {
        if (animationControls) {
            animationControls.stop()
        }

        animationControls = animate(animatedHue(), target, {
            duration: 0.3,
            ease: 'easeInOut',
            onUpdate: (value: number) => {
                setAnimatedHue(value)
            },
            onComplete: () => {
                animationControls = null
            },
        })
    }

    gradient.addColorStop(0, '#FF0000')
    gradient.addColorStop(1 / 24, '#FF4000')
    gradient.addColorStop(1 / 12, '#FF8000')
    gradient.addColorStop(1 / 8, '#FFBF00')
    gradient.addColorStop(1 / 6, '#FFFF00')
    gradient.addColorStop(5 / 24, '#BFFF00')
    gradient.addColorStop(1 / 4, '#80FF00')
    gradient.addColorStop(7 / 24, '#40FF00')
    gradient.addColorStop(1 / 3, '#00FF00')
    gradient.addColorStop(3 / 8, '#00FF40')
    gradient.addColorStop(5 / 12, '#00FF80')
    gradient.addColorStop(11 / 24, '#00FFBF')
    gradient.addColorStop(1 / 2, '#00FFFF')
    gradient.addColorStop(13 / 24, '#00BFFF')
    gradient.addColorStop(7 / 12, '#0080FF')
    gradient.addColorStop(5 / 8, '#0040FF')
    gradient.addColorStop(2 / 3, '#0000FF')
    gradient.addColorStop(17 / 24, '#4000FF')
    gradient.addColorStop(3 / 4, '#8000FF')
    gradient.addColorStop(19 / 24, '#BF00FF')
    gradient.addColorStop(5 / 6, '#FF00FF')
    gradient.addColorStop(7 / 8, '#FF00BF')
    gradient.addColorStop(11 / 12, '#FF0080')
    gradient.addColorStop(23 / 24, '#FF0040')
    gradient.addColorStop(1, '#FF0000')

    onMount(() => {
        function handleClickOnCircle(ev: MouseEvent): void {
            assertIsNotUndefined(circleRef, 'mesh ref')
            const worldPoint = new Vector2(ev.layerX, ev.layerY)
            const localPoint = circleRef.worldToLocal(worldPoint)

            if (localPoint.lengthSq() <= 50 * 50) {
                const angle = Math.atan2(localPoint.y, localPoint.x)
                const normalizedAngle = angle / (2 * Math.PI)
                const hue = normalizedAngle * 360
                animateToTarget(hue)
            }
        }
        canvas.domElement.addEventListener('click', handleClickOnCircle)
        onCleanup(() => {
            canvas.domElement.removeEventListener('click', handleClickOnCircle)

            if (animationControls) {
                animationControls.stop()
            }
        })
    })

    createEffect(() => {
        const hslColor = `hsl(${animatedHue()}, 100%, 50%)`
        const hexColor = formatHex(hslColor)
        assertIsNotUndefined(hexColor, 'hex color')
        controller.selectedColor = hexColor
        if (indicatorRef) indicatorRef.material.color = hexColor
    })

    return (
        <>
            <Mesh ref={mesh => (circleRef = mesh)} position={[50, 50]}>
                <CircleGeometry radius={42} x={0} y={0} />
                <StrokeGradientMaterial gradient={gradient} lineWidth={16} />
            </Mesh>

            <Mesh ref={mesh => (indicatorRef = mesh)} position={[50, 50]}>
                <CircleGeometry radius={16} x={0} y={0} />
                <BasicMaterial color={controller.selectedColor ?? '#FF0000'} />
            </Mesh>
        </>
    )
}
