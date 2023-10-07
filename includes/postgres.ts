import * as module from 'postgres'

import globalify from '/utilities/globalify'

globalify({
    Postgres: module,
})

declare global {
    const Postgres: typeof module
}
