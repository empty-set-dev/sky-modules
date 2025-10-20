import '@sky-modules/design/Box/global'

import { onMount, useRef } from '@builder.io/mitosis'
import { CanvasJSXRenderer, CanvasJSXRendererParameters } from '@sky-modules/canvas/jsx'

export interface CanvasProps extends CanvasJSXRendererParameters {
    children: Mitosis.Children
    width?: number
    height?: number
    w?: number
    h?: number
}
export default function Canvas(props: CanvasProps): Mitosis.Node {
    const { children, width, height, w, h } = props
    let rendererRef = useRef<CanvasJSXRenderer>(null)
    let canvasRef = useRef<HTMLCanvasElement>(null)

    onMount(() => {
        rendererRef = new CanvasJSXRenderer({ ...props, canvas: props.canvas ?? canvasRef })
        rendererRef.render(children)
        canvasRef ??= rendererRef.canvas.domElement
    })

    return (
        <>
            {props.container == null && props.canvas == null && (
                <div
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
