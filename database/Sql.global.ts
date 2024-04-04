import globalify from 'helpers/globalify/-globalify'

import * as module from './Sql'

globalify({ Sql: module.default })

declare global {
    class Sql extends module.default {}
}
