import type { Config } from 'vike/types'

export default {
    name: '@sky-modules/react/vike',
    require: {
        vike: '>=0.4.182',
    },

    extends: ['import:@sky-modules/vike/config'],

    meta: {
        onRenderHtml: {
            env: { server: true },
        },
        onRenderClient: {
            env: { client: true },
        },
    },

    onRenderHtml: 'import:@sky-modules/react/vike/renderer/+onRenderHtml:default',
    onRenderClient: 'import:@sky-modules/react/vike/renderer/+onRenderClient:default',
} satisfies Config
