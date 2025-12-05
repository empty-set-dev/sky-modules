import globalify from '@sky-modules/core/globalify'

import FieldErrorText, * as imports from '../Field.ErrorText.lite'

declare global {
    const FieldErrorText: typeof imports.default
    type FieldErrorText = typeof imports.default
    type FieldErrorTextProps<T extends BoxAs = 'div'> = imports.FieldErrorTextProps<T>
}

globalify({ FieldErrorText })
