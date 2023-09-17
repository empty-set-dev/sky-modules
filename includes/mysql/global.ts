import globalify from 'base/globalify'

import * as module from '.'

globalify({ mysql: module.default })

declare global {
    const mysql: typeof module.default
}
