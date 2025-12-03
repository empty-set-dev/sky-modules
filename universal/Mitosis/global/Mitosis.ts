import globalify from '@sky-modules/core/globalify'

import Mitosis from '../Mitosis'

declare global {
    const Mitosis: typeof Mitosis
    type Mitosis = typeof Mitosis
}

globalify({ Mitosis })
