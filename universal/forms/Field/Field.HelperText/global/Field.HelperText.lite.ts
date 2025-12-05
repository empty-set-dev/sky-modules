import globalify from '@sky-modules/core/globalify'

import FieldHelperText, * as imports from '../Field.HelperText.lite'

declare global {
    const FieldHelperText: typeof imports.default
    type FieldHelperText = typeof imports.default
    type FieldHelperTextProps<T extends BoxAs = 'div'> = imports.FieldHelperTextProps<T>
}

globalify({ FieldHelperText })
