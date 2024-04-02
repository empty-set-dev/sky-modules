import globalify from 'utilities/globalify/-globalify'

import * as module from './Sql'

globalify({ Sql: module.default })

declare global {
    class Sql extends module.default {}
}
