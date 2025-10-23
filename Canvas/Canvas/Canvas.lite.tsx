import '@sky-modules/design/Box/global'

import { onMount, useRef } from '@builder.io/mitosis'
import { CanvasJSXRenderer, CanvasJSXRendererParameters } from '@sky-modules/canvas/jsx'
import { onCleanup } from 'solid-js'

export interface CanvasProps extends CanvasJSXRendererParameters {
    children: Mitosis.Children
    size?: () => [number, number]
}
export default function Canvas(props: CanvasProps): Mitosis.Node {
    const { children, size } = props
    let rendererRef = useRef<CanvasJSXRenderer>(null)
    let canvasRef = useRef<HTMLCanvasElement>()
    let containerRef = useRef<HTMLDivElement>()

    onMount(() => {
        rendererRef = new CanvasJSXRenderer({ ...props, canvas: props.canvas ?? canvasRef })
        rendererRef.render(children)
        canvasRef ??= rendererRef.canvas.domElement

        function onFrame() {
            
        }

        onCleanup(() => {
            rendererRef?.dispose()
        })
    })

    return (
        <>
            {props.container == null && props.canvas == null && (
                <div
                    ref={containerRef}
                    style={{
                        width: (w ?? width ?? 100) * rendererRef.canvas.pixelRatio,
                        height: (h ?? height ?? 100) * rendererRef.canvas.pixelRatio,
                        overflow: 'hidden',
                    }}
                >
                    <canvas ref={canvasRef} />
                </div>
            )}
        </>
    )
}
