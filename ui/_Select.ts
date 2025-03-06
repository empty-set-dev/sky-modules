import Sprite from 'sky/views/Sprite'

declare global {
    type ButtonParams = lib.SelectParams

    type Button = lib.Select
    const Button: typeof lib.Select
}

namespace lib {
    export interface SelectItem {
        name: string
        value: string
    }
    export interface SelectParams {
        options: SelectItem[]
    }
    export class Select extends Sprite {
        options: SelectItem[]

        constructor(deps: EffectDeps, params: SelectParams) {
            super(deps)

            this.options = params.options
        }
    }
}

Object.assign(UI, lib)
