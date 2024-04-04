import globalify from 'helpers/globalify'

import * as module from '.'

globalify({ Sql: module.default })

declare global {
    class Sql extends module.default {}
}
