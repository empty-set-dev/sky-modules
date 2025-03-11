export {}

import globalify from 'sky/helpers/globalify'

declare global {
    namespace UI {}
}

if (!global.UI) {
    globalify({ UI: {} })
}
