import type { Config } from 'vike/types'

// https://vike.dev/config
export default {
    passToClient: ['errorWhileRendering', 'domain', 'lng', 'lngPrefix', 'urlLogical', 'initial'],
    // https://vike.dev/clientRouting
    clientRouting: true,
    hydrationCanBeAborted: true,
} satisfies Config
