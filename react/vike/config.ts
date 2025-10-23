import type { Config } from 'vike/types'

const Shared = {
    env: { client: true, server: true },
}
const CumulativeShared = {
    env: { client: true, server: true },
    cumulative: true,
}

export default {
    // Extension config following vike-react pattern
    name: '@sky-modules/react/vike',
    require: {
        vike: '>=0.4.182',
    },

    onRenderHtml: 'import:@sky-modules/react/vike-integration/onRenderHtml:default',
    onRenderClient: 'import:@sky-modules/react/vike-integration/onRenderClient:default',

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

    // Loading: 'import:vike-react/__internal/integration/Loading:default',

    // [ ] full react meta

    // // https://vike.dev/meta
    // meta: {
    //     Head: {
    //         env: { server: true },
    //         cumulative: true,
    //     },
    //     Layout: {
    //         env: { server: true, client: true },
    //         cumulative: true,
    //     },
    //     title: {
    //         env: { server: true, client: true },
    //     },
    //     description: {
    //         env: { server: true },
    //     },
    //     image: {
    //         env: { server: true },
    //     },
    //     viewport: {
    //         env: { server: true },
    //     },
    //     favicon: {
    //         env: { server: true },
    //         global: true,
    //     },
    //     lang: {
    //         env: { server: true, client: true },
    //     },
    //     bodyHtmlBegin: {
    //         env: { server: true },
    //         cumulative: true,
    //         global: true,
    //     },
    //     bodyHtmlEnd: {
    //         env: { server: true },
    //         cumulative: true,
    //         global: true,
    //     },
    //     htmlAttributes: {
    //         env: { server: true },
    //         global: true,
    //         cumulative: true, // for Vike extensions
    //     },
    //     bodyAttributes: {
    //         env: { server: true },
    //         global: true,
    //         cumulative: true, // for Vike extensions
    //     },
    //     ssr: {
    //         env: { config: true },
    //         effect: ssrEffect,
    //     },
    //     stream: {
    //         env: { server: true },
    //         cumulative: true,
    //     },
    //     streamIsRequired: {
    //         env: { server: true },
    //     },
    //     onBeforeRenderHtml: {
    //         env: { server: true },
    //         cumulative: true,
    //     },
    //     onAfterRenderHtml: {
    //         env: { server: true },
    //         cumulative: true,
    //     },
    //     onBeforeRenderClient: {
    //         env: { client: true },
    //         cumulative: true,
    //     },
    //     onAfterRenderClient: {
    //         env: { client: true },
    //         cumulative: true,
    //     },
    //     Wrapper: {
    //         cumulative: true,
    //         env: { client: true, server: true },
    //     },
    //     reactStrictMode: {
    //         env: { client: true, server: true },
    //     },
    //     Loading: {
    //         env: { server: true, client: true },
    //     },
    //     react: {
    //         cumulative: true,
    //         env: {},
    //     },
    // },
} satisfies Config
