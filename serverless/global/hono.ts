import globalify from '@sky-modules/core/globalify'

import app, * as imports from '../hono'

declare global {
    const app: typeof imports.default
    type app = typeof imports.default
    type HonoEnv = imports.HonoEnv
}

globalify({ app })
