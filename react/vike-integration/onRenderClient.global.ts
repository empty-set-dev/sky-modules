import globalify from '@sky-modules/core/globalify'

import onRenderClient, * as imports from './onRenderClient'

declare global {
    const onRenderClient: typeof imports.default
    type onRenderClient = typeof imports.default
}

globalify({ onRenderClient, ...imports })
