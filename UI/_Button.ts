import globalify from 'sky/utilities/globalify'

import { BaseButton, BaseButtonParams } from './__BaseButton'

declare global {
    namespace UI {
        type ButtonParams = UILib.ButtonParams
        class Button extends UILib.Button {}
    }
}

namespace UILib {
    export interface ButtonParams extends BaseButtonParams {
        click: () => void
    }
    export class Button extends BaseButton {
        click!: () => void

        constructor(deps: EffectDeps, params: ButtonParams) {
            super(deps, params)

            this.click = params.click
        }
    }
}

globalify.namespace('UI', UILib)
