import globalify from '@sky-modules/core/globalify'

import Field_Label_lite, * as imports from './Field.Label.lite'

declare global {
    const Field_Label_lite: typeof imports.default
    type Field_Label_lite = typeof imports.default
    type FieldLabelProps = imports.FieldLabelProps
}

globalify({ Field_Label_lite, ...imports })
