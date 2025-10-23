import type { Config } from 'vike/types'
import Mitosis from '@sky-modules/universal/Mitosis/Mitosis.namespace'
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
            'async-data'?: ((
                pageContext: Vike.PageContext,
                signal: AbortSignal
            ) => Promise<object>)[]
            context?: unknown
            title?: string[]
            description?: string[]
            image?: string
            viewport?: string
            ssr?: boolean
            Head?: Mitosis.
            Layout?: Vike.ComponentType[]
            Wrapper?: Vike.ComponentType[]
            Loading?: Vike.ComponentType[]
            favicon?: string
            lang?: string
            bodyHtmlBegin?: string[]
            bodyHtmlEnd?: string[]
            htmlAttributes?: Record<string, string>
            bodyAttributes?: Record<string, string>
            stream?: boolean[]
            streamIsRequired?: boolean
            onBeforeRenderHtml?: ((
                pageContext: Vike.PageContext,
                html: string
            ) => Promise<string>)[]
            onAfterRenderHtml?: ((pageContext: Vike.PageContext, html: string) => Promise<string>)[]
            onBeforeRenderClient?: ((pageContext: Vike.PageContext) => Promise<void>)[]
            onAfterRenderClient?: ((pageContext: Vike.PageContext) => Promise<void>)[]
        }
    }
}

export default {
    // Extension config following vike-react pattern
    name: '@sky-modules/react/vike',
    require: {
        vike: '>=0.4.182',
    },

    clientRouting: true,
    hydrationCanBeAborted: true,

    Loading: 'import:vike-react/__internal/integration/Loading:default',

    // https://vike.dev/meta
    meta: {
        'async-data': CumulativeShared,
        data: Shared,
        context: CumulativeShared,
        title: CumulativeShared,
        description: CumulativeShared,
        image: Shared,
        viewport: Shared,
        ssr: { env: { server: true } },
        Head: {
            env: { server: true },
            cumulative: true,
        },
        Layout: {
            env: { server: true, client: true },
            cumulative: true,
        },
        Wrapper: {
            cumulative: true,
            env: { client: true, server: true },
        },
        Loading: {
            env: { server: true, client: true },
        },
        favicon: {
            env: { server: true },
            global: true,
        },
        lang: {
            env: { server: true, client: true },
        },
        bodyHtmlBegin: {
            env: { server: true },
            cumulative: true,
            global: true,
        },
        bodyHtmlEnd: {
            env: { server: true },
            cumulative: true,
            global: true,
        },
        htmlAttributes: {
            env: { server: true },
            global: true,
            cumulative: true,
        },
        bodyAttributes: {
            env: { server: true },
            global: true,
            cumulative: true,
        },
        stream: {
            env: { server: true },
            cumulative: true,
        },
        streamIsRequired: {
            env: { server: true },
        },
        onBeforeRenderHtml: {
            env: { server: true },
            cumulative: true,
        },
        onAfterRenderHtml: {
            env: { server: true },
            cumulative: true,
        },
        onBeforeRenderClient: {
            env: { client: true },
            cumulative: true,
        },
        onAfterRenderClient: {
            env: { client: true },
            cumulative: true,
        },
    },
} satisfies Config
