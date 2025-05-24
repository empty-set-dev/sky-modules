import globalify from 'sky/utilities/globalify'

import * as module from '.'

globalify({ idle: module.default })

declare global {
    const idle: (timeout: Time) => Promise<void>
}
