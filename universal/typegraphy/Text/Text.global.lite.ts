import globalify from '@sky-modules/core/globalify'

import Text_lite, * as imports from './Text.lite'

declare global {
    const Text_lite: typeof imports.default
    type Text_lite = typeof imports.default
    type TextProps = imports.TextProps
}

globalify({ Text_lite, ...imports })
