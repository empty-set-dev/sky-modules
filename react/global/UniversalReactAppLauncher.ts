import globalify from '@sky-modules/core/globalify'

import UniversalReactAppLauncher, * as imports from '../UniversalReactAppLauncher'

declare global {
    const UniversalReactAppLauncher: typeof imports.default
    type UniversalReactAppLauncher = typeof imports.default
}

globalify({ UniversalReactAppLauncher })
