import { useContext } from '@builder.io/mitosis'

import CanvasContext from './Canvas.context.lite'

export default function useCanvasContext(): HTMLCanvasElement {
    return useContext(CanvasContext) as HTMLCanvasElement
}
