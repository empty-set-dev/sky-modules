import globalify from '@sky-modules/core/globalify'

import onRenderHtml, * as imports from './onRenderHtml'

declare global {
    const onRenderHtml: typeof imports.default
    type onRenderHtml = typeof imports.default
}

globalify({ onRenderHtml, ...imports })
