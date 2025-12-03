import globalify from '@sky-modules/core/globalify'

import Svg, * as imports from '../Svg'

declare global {
    const Svg: typeof imports.default
    type Svg = typeof imports.default
    type SvgParameters = imports.SvgParameters
}

globalify({ Svg })
