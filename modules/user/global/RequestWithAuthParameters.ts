import globalify from '@sky-modules/core/globalify'

import RequestWithAuthParameters, * as imports from '../RequestWithAuthParameters'

declare global {
    const RequestWithAuthParameters: typeof imports.default
    type RequestWithAuthParameters = typeof imports.default
}

globalify({ RequestWithAuthParameters })
