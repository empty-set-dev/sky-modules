import globalify from 'utilities/globalify'

import * as module from '.'

globalify({ Three: module })

declare global {
    namespace Three {
        export { module }
    }
}
