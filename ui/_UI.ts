export {}

import globalify from 'sky/utilities/globalify'

declare global {
    namespace UI {}
}

if (!global.UI) {
    globalify({ UI: {} })
}
