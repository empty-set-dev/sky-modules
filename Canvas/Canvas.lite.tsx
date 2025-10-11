import { onMount, useRef } from '@builder.io/mitosis'
import { CanvasJSXRenderer, CanvasJSXRendererParameters } from '@sky-modules/canvas/jsx'

declare global {
    namespace JSX {
        interface IntrinsicElements {
            canvas: {
                ref?: HTMLCanvasElement
            }

            div: {
                style?: any
                children: Mitosis.Children
            }
        }
    }
}

export interface CanvasProps extends CanvasJSXRendererParameters {
    children: Mitosis.Children
}
export default function Canvas(props: CanvasProps): Mitosis.Node {
    let rendererRef = useRef<CanvasJSXRenderer>(null)
    let canvasRef = useRef<HTMLCanvasElement>(null)

    onMount(() => {
        rendererRef = new CanvasJSXRenderer({ ...props, canvas: props.canvas ?? canvasRef })
        rendererRef.render(props.children)
    })

    return (
        <>
            {props.container == null && props.canvas == null && (
                <div
                    style={{
                        width: '100px',
                        height: '100px',
                        overflow: 'hidden',
                    }}
                >
                    <canvas ref={canvasRef} />
                </div>
            )}
        </>
    )
}
