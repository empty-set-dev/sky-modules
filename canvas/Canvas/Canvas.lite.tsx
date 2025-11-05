import '@sky-modules/design/Box/global'

import { onMount, onUnMount, useRef } from '@builder.io/mitosis'
import Mitosis from '@sky-modules/universal/Mitosis'

import { CanvasJSXRenderer, CanvasJSXRendererParameters } from '#/jsx'

export interface CanvasProps extends CanvasJSXRendererParameters {
    children: Mitosis.Children
    size?: () => [number, number]
}
export default function Canvas(props: CanvasProps): Mitosis.Node {
    const { size } = props
    let rendererRef = useRef<CanvasJSXRenderer>(null)
    let canvasRef = useRef<HTMLCanvasElement>(null)
    let containerRef = useRef<HTMLDivElement>(null)
    let frameId = useRef<number>(null)

    onMount(() => {
        rendererRef = new CanvasJSXRenderer({ ...props, canvas: props.canvas ?? canvasRef })
        rendererRef.render(props.children)
        canvasRef ??= rendererRef.canvas.domElement

        function onFrame(): void {
            const [w, h] = size ? size() : [window.innerWidth, window.innerHeight]

            canvasRef.width = w
            canvasRef.height = h

            frameId = requestAnimationFrame(onFrame)
        }

        frameId = requestAnimationFrame(onFrame)
    })

    onUnMount(() => {
        rendererRef?.dispose()
        cancelAnimationFrame(frameId)
    })

    return (
        <>
            {props.container == null && props.canvas == null && (
                <Box ref={containerRef} sx="overflow-hidden">
                    <Box as="canvas" ref={canvasRef} />
                </Box>
            )}
        </>
    )
}
