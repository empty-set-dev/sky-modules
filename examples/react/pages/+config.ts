const Shared = {
    env: { client: true, server: true },
}
const CumulativeShared = {
    env: { client: true, server: true },
    cumulative: true,
}

declare global {
    namespace Vike {
        interface Config {
            'async-data'?: ((pageContext: PageContext, signal: AbortSignal) => Promise<object>)[]
        }
    }
}

export default {
    clientRouting: true,
    hydrationCanBeAborted: true,
    meta: {
        'async-data': CumulativeShared,
        data: Shared,
        context: CumulativeShared,
        title: CumulativeShared,
        description: CumulativeShared,
        image: Shared,
        viewport: Shared,
        htmlAttributes: CumulativeShared,
        bodyAttributes: CumulativeShared,
        ssr: { env: { server: true } },
    },
} as Vike.Config
