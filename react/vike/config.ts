import type { Config } from 'vike/types'

export default {
    name: '@sky-modules/react/vike',
    require: {
        vike: '>=0.4.182',
    },

    onRenderHtml: 'import:@sky-modules/react/vike-integration/onRenderHtml:default',
    onRenderClient: 'import:@sky-modules/react/vike-integration/onRenderClient:default',
} satisfies Config
