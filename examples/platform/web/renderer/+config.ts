import type { Config } from 'vike/types'

// https://vike.dev/config
export default {
    prerender: {
        noExtraDir: true,
    },
    passToClient: [
        'errorWhileRendering',
        'is404',
        'domain',
        'lng',
        'lngPrefix',
        'urlLogical',
        'theme',
        'initial',
    ],
    // https://vike.dev/clientRouting
    clientRouting: true,
    hydrationCanBeAborted: true,
} satisfies Config
