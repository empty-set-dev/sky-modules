import { Mesh, StrokeGradientMaterial } from '@sky-modules/Canvas/jsx'
import { CircleGeometry } from '@sky-modules/canvas/jsx'
import { useCanvas } from '@sky-modules/canvas/jsx'
import MeshClass from '@sky-modules/Canvas/Mesh'
import { assertIsNotUndefined } from '@sky-modules/core'
import Vector2 from '@sky-modules/math/Vector2'
import JSX, { createEffect, createSignal } from 'sky-jsx'

interface ColorPickerControllerParameters {
    getSelectedColor: () => string | null
    setSelectedColor: (selectedColor: string) => void
}
class ColorPickerController {
    get selectedColor(): string | null {
        return this.__getSelectedColor()
    }
    set selectedColor(color: string) {
        this.__setSelectedColor(color)
    }

    constructor(parameters: ColorPickerControllerParameters) {
        this.__getSelectedColor = parameters.getSelectedColor
        this.__setSelectedColor = parameters.setSelectedColor
    }

    private __getSelectedColor: () => string | null
    private __setSelectedColor: (selectedColor: string) => void
}

export function useColorPicker(): ColorPickerController {
    const [getSelectedColor, setSelectedColor] = createSignal<string | null>(null)

    return new ColorPickerController({ getSelectedColor, setSelectedColor })
}

export interface ColorPickerProps {
    controller: ColorPickerController
}
export default function ColorPicker({ controller }: ColorPickerProps): JSX.Return {
    const canvas = useCanvas()
    let meshRef: MeshClass
    const gradient = canvas.drawContext.createConicGradient(0, 0, 0)

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

    createEffect(() => {
        function onMouseMove(ev: MouseEvent): void {
            const rect = canvas.domElement.getBoundingClientRect()
            const x = ev.clientX - rect.left
            const y = ev.clientY - rect.top

            assertIsNotUndefined(meshRef, 'mesh ref')

            const worldPoint = new Vector2(x, y)
            const localPoint = meshRef.worldToLocal(worldPoint)

            if (localPoint.lengthSq() <= 50 * 50) {
                const angle = Math.atan2(localPoint.y, localPoint.x)
                const normalizedAngle = (angle + Math.PI) / (2 * Math.PI)
                const hue = normalizedAngle * 360
                controller.selectedColor = `hsl(${hue}, 100%, 50%)`
            }
        }
        canvas.domElement.addEventListener('mousemove', onMouseMove)
        return () => {
            canvas.domElement.removeEventListener('mousemove', onMouseMove)
        }
    })

    return (
        <Mesh ref={mesh => (meshRef = mesh)} position={[50, 50]}>
            <CircleGeometry radius={50} x={0} y={0} />
            <StrokeGradientMaterial gradient={gradient} lineWidth={10} />
        </Mesh>
    )
}
