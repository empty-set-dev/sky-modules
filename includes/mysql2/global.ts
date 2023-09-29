import globalify from 'utilities/globalify'

import * as module from '.'

globalify({ Mysql: module.default })

declare global {
    interface Mysql {}
    const Mysql: typeof module.default & Mysql
}
