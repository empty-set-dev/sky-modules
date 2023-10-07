import globalify from 'utilities/globalify'

import * as module from 'mysql2'

globalify({
    Mysql: {...module},
})

declare global {
    const Mysql: typeof module
}
