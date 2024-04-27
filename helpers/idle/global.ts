import globalify from 'helpers/globalify'

import * as module from '.'

globalify({ idle: module.default })

declare global {
    const idle: (timeout: number) => Promise<void>
}
