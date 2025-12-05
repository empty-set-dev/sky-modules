import globalify from '@sky-modules/core/globalify'

import getRequestAuthParameters, * as imports from '../getAuthRequestParameters'

declare global {
    const getRequestAuthParameters: typeof imports.default
    type getRequestAuthParameters = typeof imports.default
}

globalify({ getRequestAuthParameters })
