export {}

import globalify from 'sky/helpers/globalify'

declare global {
    namespace UI {}
}

globalify({ UI: {} })
