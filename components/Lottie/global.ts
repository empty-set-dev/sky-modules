import globalify from '/utilities/globalify'

import * as module from '.'

globalify({ Lottie: module.default })

declare global {
    const Lottie: typeof module.default
}
