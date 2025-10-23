import globalify from '@sky-modules/core/globalify'

import Field_Root_lite, * as imports from './Field.Root.lite'

declare global {
    const Field_Root_lite: typeof imports.default
    type Field_Root_lite = typeof imports.default
    type FieldRootProps = imports.FieldRootProps
}

globalify({ Field_Root_lite, ...imports })
