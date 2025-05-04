import globalify from 'sky/utilities/globalify'

declare global {
    class Canvas extends lib.Canvas {}
}

namespace lib {
    export interface CanvasParameters {
        size(): [number, number]
    }
    export class Canvas {
        size: () => [number, number]

        constructor(parameters: CanvasParameters) {
            this.size = parameters.size
        }
    }
}

globalify(lib)
