import globalify from '@sky-modules/core/globalify'

import Field_ErrorText_lite, * as imports from './Field.ErrorText.lite'

declare global {
    const Field_ErrorText_lite: typeof imports.default
    type Field_ErrorText_lite = typeof imports.default
    type FieldErrorTextProps = imports.FieldErrorTextProps
}

globalify({ Field_ErrorText_lite, ...imports })
