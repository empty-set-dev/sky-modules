import globalify from '@sky-modules/core/globalify'

import Button, * as imports from '../Button.lite'

declare global {
    const Button: typeof imports.default
    type Button = typeof imports.default
    type ButtonProps<T extends BoxAs = 'button'> = imports.ButtonProps<T>
}

globalify({ Button })
