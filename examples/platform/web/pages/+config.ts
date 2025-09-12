import { Config } from 'vike/types'

export default {
    clientRouting: true,
    hydrationCanBeAborted: true,
    meta: {
        data: {
            env: { client: true, server: true },
            cumulative: true,
        },
        foo: {
            env: { client: true, server: true },
            cumulative: true,
        },
    },
} as Config
