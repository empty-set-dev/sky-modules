import globalify from 'sky/utilities/globalify'

import * as pkg from '.'

globalify({ idle: pkg.default })

declare global {
    const idle: (timeout: Time) => Promise<void>
}
