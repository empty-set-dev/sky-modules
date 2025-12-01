import globalify from '@sky-modules/core/globalify'

import Field_HelperText, * as imports from '../Field.HelperText.lite'

declare global {
    const Field_HelperText: typeof imports.default
    type Field_HelperText = typeof imports.default
    type FieldHelperTextProps = imports.FieldHelperTextProps
}

globalify({ Field_HelperText })
