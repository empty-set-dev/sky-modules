import type { Config } from 'vike/types'

// https://vike.dev/config
export default {
    passToClient: ['errorWhileRendering'],
    // https://vike.dev/clientRouting
    clientRouting: true,
    hydrationCanBeAborted: true,
} satisfies Config
