import globalify from '@sky-modules/core/globalify'

import * as imports from '../twrn'

declare global {
    const mergeTailwindClasses: typeof imports.mergeTailwindClasses
    const tailwindClassesToCSS: typeof imports.tailwindClassesToCSS
}

globalify({ ...imports })
