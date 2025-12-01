import globalify from '@sky-modules/core/globalify'

import Lottie, * as imports from '../Lottie'

declare global {
    const Lottie: typeof imports.default
    type Lottie = typeof imports.default
}

globalify({ Lottie })
