import globalify from '@sky-modules/core/globalify'

import Field_Root, * as imports from '../Field.Root.lite'

declare global {
    const Field_Root: typeof imports.default
    type Field_Root = typeof imports.default
    type FieldRootProps = imports.FieldRootProps
}

globalify({ Field_Root })
