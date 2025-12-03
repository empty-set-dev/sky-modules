import globalify from '@sky-modules/core/globalify'

import Group, * as imports from '../Group'

declare global {
    const Group: typeof imports.default
    type Group = typeof imports.default
}

globalify({ Group })
