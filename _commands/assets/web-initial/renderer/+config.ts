import type { Config } from 'vike/types'

// https://vike.dev/config
export default {
    passToClient: [
        'errorWhileRendering',
        'initial',
        'domain',
        'lng',
        'lngPrefix',
        'urlLogical',
        'store',
        'dehydratedState',
        'ns',
        'resources',
        'ip',
    ],
    // https://vike.dev/clientRouting
    clientRouting: true,
    hydrationCanBeAborted: true,
} satisfies Config
