import { onMount, setContext, useRef } from '@builder.io/mitosis'
import { CanvasJSXRenderer, CanvasJSXRendererParameters } from '@sky-modules/canvas/jsx'

import CanvasContext from './Canvas.context.lite'

declare global {
    namespace JSX {
        interface IntrinsicElements {
            canvas: {
                ref?: HTMLCanvasElement
            }

            div: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        canvasRef ??= rendererRef.canvas.domElement
    })

    return (
        <CanvasContextProvider value={canvasRef}>
            {props.container == null && props.canvas == null && (
                <div
                    style={{
                        width: '10000px',
                        height: '10000px',
                        overflow: 'hidden',
                    }}
                >
                    <canvas ref={canvasRef} />
                </div>
            )}
        </CanvasContextProvider>
    )
}

interface CanvasContextProviderProps {
    value: HTMLCanvasElement
    children: Mitosis.Children
}
function CanvasContextProvider(props: CanvasContextProviderProps): Mitosis.Node {
    setContext(CanvasContext, {
        value: props.value,
    })
    return <>{props.children}</>
}
