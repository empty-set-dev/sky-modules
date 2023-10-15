import * as module from 'mysql2'
import globalify from 'utilities/globalify'

globalify({
    Mysql: { ...module },
})

declare global {
    namespace Mysql {}
    interface Mysql {}
    const Mysql: typeof module & Mysql
}
