// import globalify from '@sky-modules/core/globalify'

// import { BaseButton, BaseButtonParameters } from './__BaseButton'

// declare global {
//     namespace UI {
//         type ButtonParams = lib.ButtonParameters
//         class Button extends lib.Button {}
//     }
// }

// namespace lib {
//     export interface ButtonParameters extends BaseButtonParameters {
//         click: () => void
//     }
//     export class Button extends BaseButton {
//         click!: () => void

//         constructor(dep: EffectDep, params: ButtonParameters) {
//             super(deps, params)

//             this.click = params.click
//         }
//     }
// }

// globalify.namespace('UI', lib)
