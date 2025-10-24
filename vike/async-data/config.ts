import type { Config } from 'vike/types'

export default {
    name: '@sky-modules/react/vike',
    require: {
        vike: '>=0.4.182',
    },

    extends: ['import:@sky-modules/vike/config'],

    onBeforeRenderHtml: 'import:@sky-modules/react/vike/renderer/+onBeforeRenderHtml:default',
} satisfies Config
