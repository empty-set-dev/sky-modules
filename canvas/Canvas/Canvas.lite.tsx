import '@sky-modules/design/Box/global'

import { onMount, onUnMount, useRef, useState } from '@builder.io/mitosis'
import Mitosis from '@sky-modules/universal/Mitosis'

import { CanvasJSXRenderer, CanvasJSXRendererParameters } from '#/jsx'

export interface CanvasProps extends CanvasJSXRendererParameters {
    children: Mitosis.Children
    size?: () => [number, number]
    showFps?: boolean
}
export default function Canvas(props: CanvasProps): Mitosis.Node {
    const { size } = props
    const showFps = props.showFps ?? true
    let rendererRef: CanvasJSXRenderer | null = null
    let canvasRef = useRef<HTMLCanvasElement>(null)
    let containerRef = useRef<HTMLDivElement>(null)
    let frameId: number | null = null
    let fpsCounter = 0
    let lastFpsUpdate = 0
    const [fps, setFps] = useState(0)

    onMount(() => {
        rendererRef = new CanvasJSXRenderer({ ...props, canvas: props.canvas ?? canvasRef })
        rendererRef.render(props.children)
        canvasRef ??= rendererRef.canvas.domElement

        function onFrame(timestamp: number): void {
            const [w, h] = size ? size() : [window.innerWidth, window.innerHeight]

            canvasRef.width = w
            canvasRef.height = h

            // FPS calculation
            fpsCounter++
            if (timestamp - lastFpsUpdate >= 1000) {
                setFps(Math.round((fpsCounter * 1000) / (timestamp - lastFpsUpdate)))
                fpsCounter = 0
                lastFpsUpdate = timestamp
            }

            frameId = requestAnimationFrame(onFrame)
        }

        frameId = requestAnimationFrame(onFrame)

        // Cleanup
        onUnMount(() => {
            rendererRef?.dispose()

            if (frameId !== null) {
                cancelAnimationFrame(frameId)
            }
        })
    })

    return (
        <>
            {props.container == null && props.canvas == null && (
                <Box ref={containerRef} sx="overflow-hidden position-relative">
                    <Box as="canvas" ref={canvasRef} />
                    {showFps && (
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                padding: '8px',
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                color: 'white',
                                fontFamily: 'monospace',
                                fontSize: '14px',
                                zIndex: 1000,
                                pointerEvents: 'none'
                            }}
                        >
                            FPS: {fps}
                        </div>
                    )}
                </Box>
            )}
        </>
    )
}
