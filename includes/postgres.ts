import * as module from 'postgres'

import globalify from '/utilities/globalify'

globalify({
    Postgres: (module as never as { default: never }).default,
})

declare global {
    const Postgres: typeof module
}
