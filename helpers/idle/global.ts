import globalify from 'sky/helpers/globalify'

import * as lib from '.'

globalify({ idle: lib.default })

declare global {
    const idle: (timeout: number) => Promise<void>
}
