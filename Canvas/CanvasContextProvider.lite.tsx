import { setContext } from '@builder.io/mitosis'

import CanvasContext from './Canvas.context.lite'

interface CanvasContextProviderProps {
    value: HTMLCanvasElement
    children: Mitosis.Children
}
export default function CanvasContextProvider(props: CanvasContextProviderProps): Mitosis.Node {
    setContext(CanvasContext, {
        value: props.value,
    })
    return <>{props.children}</>
}
