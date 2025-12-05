import globalify from '@sky-modules/core/globalify'

import getEnvVariable, * as imports from '../getEnvVariable'

declare global {
    const getEnvVariable: typeof imports.default
    type getEnvVariable = typeof imports.default
}

globalify({ getEnvVariable })
