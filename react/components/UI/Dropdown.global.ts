import globalify from '@sky-modules/core/globalify'

import Dropdown, * as imports from './Dropdown'

declare global {
    const Dropdown: typeof imports.default
    type Dropdown = typeof imports.default
    type DropdownProps = imports.DropdownProps
}

globalify({ Dropdown, ...imports })
