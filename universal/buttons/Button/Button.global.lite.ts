import globalify from '@sky-modules/core/globalify'

import Button_lite, * as imports from './Button.lite'

declare global {
    const Button_lite: typeof imports.default
    type Button_lite = typeof imports.default
    type ButtonProps = imports.ButtonProps
}

globalify({ Button_lite, ...imports })
