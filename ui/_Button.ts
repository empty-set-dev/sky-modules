import './_UI'
import 'sky/Canvas/global'

import { BaseButton, BaseButtonParams } from './_BaseButton'

declare global {
    namespace UI {
        type ButtonParams = lib.ButtonParams

        type Button = lib.Button
        const Button: typeof lib.Button
    }
}

namespace lib {
    export interface ButtonParams extends BaseButtonParams {
        click: () => void
    }
    export class Button extends BaseButton {
        click: () => void

        constructor(deps: EffectDeps, params: ButtonParams) {
            super(deps, params)

            this.click = params.click
        }
    }
}

Object.assign(UI, lib)
