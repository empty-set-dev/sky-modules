import globalify from '@sky-modules/core/globalify'

import TextArea, * as imports from './TextArea'

declare global {
    const TextArea: typeof imports.default
    type TextArea = typeof imports.default
    type TextAreaProps = imports.TextAreaProps
}

globalify({ TextArea, ...imports })
