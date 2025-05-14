import globalify from 'sky/utilities/globalify'

import { BaseButton, BaseButtonParams } from './__BaseButton'

declare global {
    namespace UI {
        type ButtonParams = UIModule.ButtonParams
        class Button extends UIModule.Button {}
    }
}

namespace UIModule {
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

globalify.namespace('UI', UIModule)
