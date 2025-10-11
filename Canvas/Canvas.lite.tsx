import { onInit, useRef } from '@builder.io/mitosis'
import { CanvasJSXRenderer, CanvasJSXRendererParameters } from '@sky-modules/canvas/jsx'

export interface CanvasProps extends CanvasJSXRendererParameters {
    children: Mitosis.Children
}
export default function Canvas(props: CanvasProps): Mitosis.Node {
    let renderer = useRef<CanvasJSXRenderer>(null)

    onInit(() => {
        renderer = new CanvasJSXRenderer(props)
        renderer.render(props.children)
    })

    return null
}
