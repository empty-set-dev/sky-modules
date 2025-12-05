import globalify from '@sky-modules/core/globalify'

import onBeforeRenderHtml, * as imports from '../+onBeforeRenderHtml'

declare global {
    const onBeforeRenderHtml: typeof imports.default
    type onBeforeRenderHtml = typeof imports.default
    const config: typeof imports.config
}

globalify({ onBeforeRenderHtml, ...imports })
