import globalify from 'utilities/globalify'

import * as module from '../node_modules/mysql2'

globalify({
    Mysql: module,
})

declare global {
    const Mysql: typeof module
}
