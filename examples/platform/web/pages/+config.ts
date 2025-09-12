import { Config } from 'vike/types'

export default {
    clientRouting: true,
    hydrationCanBeAborted: true,
    meta: {
        data: {
            env: { client: true, server: true },
        },
        context: {
            env: { client: true, server: true, config: true },
            cumulative: true,
            effect({ configValue, configDefinedAt }) {
                console.log(configDefinedAt, configDefinedAt.indexOf('/+config') !== -1)
            },
        },
        foo: {
            env: { config: true },
            cumulative: true,
        },
    },
} as Config
