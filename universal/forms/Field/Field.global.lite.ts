import globalify from '@sky-modules/core/globalify'

import Field, * as imports from './Field.lite'

declare global {
    const Field: typeof imports.default
    type Field = typeof imports.default
    type FieldProps = imports.FieldProps
}

globalify({ Field })
