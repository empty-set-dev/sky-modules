import globalify from 'helpers/globalify'

import * as module from '.'

globalify({ Sql: module.default })

declare global {
    interface Sql {}
    class Sql extends module.default {}
}
