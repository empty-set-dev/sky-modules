import globalify from '@sky-modules/core/globalify'

import Field_ErrorText, * as imports from './Field.ErrorText.lite'

declare global {
    const Field_ErrorText: typeof imports.default
    type Field_ErrorText = typeof imports.default
    type FieldErrorTextProps = imports.FieldErrorTextProps
}

globalify({ Field_ErrorText })
