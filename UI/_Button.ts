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

            return asyncConstructor(this, Button.asyncConstructor2, params)
        }

        private static async asyncConstructor2(this: Button, params: ButtonParams): Promise<void> {
            this.click = params.click
        }
    }
}

globalify.namespace('UI', UILib)
