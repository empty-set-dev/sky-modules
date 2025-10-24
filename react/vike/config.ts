import type { Config } from 'vike/types'

export default {
    name: '@sky-modules/react/vike',
    require: {
        vike: '>=0.4.182',
    },
    extends: ['import:@sky-modules/vike/config'],
    onRenderHtml: 'import:@sky-modules/react/vike/+onRenderHtml:default',
    onRenderClient: 'import:@sky-modules/react/vike/+onRenderClient:default',
} satisfies Config
