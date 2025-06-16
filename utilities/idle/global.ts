import globalify from 'sky/utilities/globalify'

import * as lib from '.'

globalify({ idle: lib.default })

declare global {
    const idle: (timeout: Time) => Promise<void>
}
