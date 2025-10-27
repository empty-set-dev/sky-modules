import globalify from '@sky-modules/core/globalify'

import initPackage, * as imports from './init--package.json'

declare global {
    const initPackage: typeof imports.default
    type initPackage = typeof imports.default
}

globalify({ initPackage })
