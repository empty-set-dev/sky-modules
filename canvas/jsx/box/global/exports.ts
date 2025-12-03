import globalify from '@sky-modules/core/globalify'

import * as imports from '../exports'

declare global {
    const Box: typeof imports.Box
    const type BoxProps: typeof imports.type BoxProps
    const parseUnit: typeof imports.parseUnit
    const parseSpacing: typeof imports.parseSpacing
    const kebabToCamel: typeof imports.kebabToCamel
    const normalizeProperties: typeof imports.normalizeProperties
    const mergeStyles: typeof imports.mergeStyles
    const extractDirectCSSProps: typeof imports.extractDirectCSSProps
    const type ParsedStyles: typeof imports.type ParsedStyles
    const : typeof imports.
    const mergeTailwindClasses: typeof imports.mergeTailwindClasses
    const tailwindClassesToCSS: typeof imports.tailwindClassesToCSS
}

globalify({ ...imports })
