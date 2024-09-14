import globalify from 'sky/helpers/globalify'

import * as pkg from '.'

globalify({ idle: pkg.default })

declare global {
    const idle: (timeout: number) => Promise<void>
}
