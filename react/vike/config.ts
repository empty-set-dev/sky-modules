import type { Config } from 'vike/types'

export default {
    name: '@sky-modules/react/vike',
    require: {
        vike: '>=0.4.182',
    },
    clientRouting: true,
    meta: {
        onRenderClient: {
            // КРИТИЧНО: укажите что это только клиент
            env: { client: true, server: false },
        },
        onRenderHtml: {
            // КРИТИЧНО: укажите что это только сервер
            env: { server: true, client: false },
        },
    },
    onRenderHtml: 'import:@sky-modules/react/vike/+onRenderHtml:default',
    onRenderClient: 'import:@sky-modules/react/vike/+onRenderClient:default',
} satisfies Config
