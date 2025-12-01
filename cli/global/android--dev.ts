import globalify from '@sky-modules/core/globalify'

import devAndroid, * as imports from '../android--dev'

declare global {
    const devAndroid: typeof imports.default
    type devAndroid = typeof imports.default
}

globalify({ devAndroid })
