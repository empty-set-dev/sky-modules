import globalify from '@sky-modules/core/globalify'

import Text, * as imports from '../Text.lite'

declare global {
    const Text: typeof imports.default
    type Text = typeof imports.default
    type TextProps = imports.TextProps
}

globalify({ Text })
