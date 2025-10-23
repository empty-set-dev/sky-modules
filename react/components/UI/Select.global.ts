import globalify from '@sky-modules/core/globalify'

import Select, * as imports from './Select'

declare global {
    const Select: typeof imports.default
    type Select = typeof imports.default
    type SelectProps = imports.SelectProps
}

globalify({ Select, ...imports })
