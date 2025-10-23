import globalify from '@sky-modules/core/globalify'

import Field_lite, * as imports from './Field.lite'

declare global {
    const Field_lite: typeof imports.default
    type Field_lite = typeof imports.default
    type FieldProps = imports.FieldProps
}

globalify({ Field_lite, ...imports })
