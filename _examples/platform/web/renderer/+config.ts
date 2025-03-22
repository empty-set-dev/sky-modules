const onBeforeRoute = 'import:sky/platform/web/renderer/+onBeforeRoute'
const onRenderHtml = 'import:sky/platform/web/renderer/+onRenderHtml'

import type { Config } from 'vike/types'

// https://vike.dev/config
export default {
    passToClient: [
        'errorWhileRendering',
        'is404',
        'domain',
        'lng',
        'lngPrefix',
        'urlLogical',
        'initial',
    ],
    // https://vike.dev/clientRouting
    clientRouting: true,
    hydrationCanBeAborted: true,

    onRenderHtml,
    onBeforeRoute: onBeforeRoute,
} satisfies Config
