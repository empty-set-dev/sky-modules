import globalify from '@sky-modules/core/globalify'

import ios, * as imports from '../ios'

declare global {
    const ios: typeof imports.default
    type ios = typeof imports.default
}

globalify({ ios })
