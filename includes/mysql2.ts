import * as module from 'mysql2'
import globalify from 'utilities/globalify'

globalify({
    Mysql: { ...module },
})

declare global {
    const Mysql: typeof module
}
