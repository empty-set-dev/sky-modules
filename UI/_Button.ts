import globalify from 'sky/utilities/globalify'

import { BaseButton, BaseButtonParameters } from './__BaseButton'

declare global {
    namespace UI {
        type ButtonParams = module.ButtonParameters
        class Button extends module.Button {}
    }
}

namespace module {
    export interface ButtonParameters extends BaseButtonParameters {
        click: () => void
    }
    export class Button extends BaseButton {
        click!: () => void

        constructor(deps: EffectDeps, params: ButtonParameters) {
            super(deps, params)

            this.click = params.click
        }
    }
}

globalify.namespace('UI', module)
