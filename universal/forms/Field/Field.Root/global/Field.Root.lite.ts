import globalify from '@sky-modules/core/globalify'

import FieldRoot, * as imports from '../Field.Root.lite'

declare global {
    const FieldRoot: typeof imports.default
    type FieldRoot = typeof imports.default
    type FieldRootProps<T extends BoxAs = 'div'> = imports.FieldRootProps<T>
}

globalify({ FieldRoot })
