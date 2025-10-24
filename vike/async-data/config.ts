import type { Config } from 'vike/types'

export default {
    name: '@sky-modules/vike/async-data',
    require: {
        vike: '>=0.4.182',
    },

    extends: ['import:@sky-modules/vike/config'],

    onBeforeRenderHtml: 'import:@sky-modules/async-data/renderer/+onBeforeRenderHtml:default',
} satisfies Config
