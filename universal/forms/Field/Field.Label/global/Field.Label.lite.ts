import globalify from '@sky-modules/core/globalify'

import FieldLabel, * as imports from '../Field.Label.lite'

declare global {
    const FieldLabel: typeof imports.default
    type FieldLabel = typeof imports.default
    type FieldLabelProps<T extends BoxAs = 'label'> = imports.FieldLabelProps<T>
}

globalify({ FieldLabel })
