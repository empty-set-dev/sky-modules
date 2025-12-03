import globalify from '@sky-modules/core/globalify'

import * as imports from '../styles-parser'

declare global {
    const parseUnit: typeof imports.parseUnit
    const parseSpacing: typeof imports.parseSpacing
    const kebabToCamel: typeof imports.kebabToCamel
    const normalizeProperties: typeof imports.normalizeProperties
    const mergeStyles: typeof imports.mergeStyles
    const extractDirectCSSProps: typeof imports.extractDirectCSSProps
    const expandPandaCSSProps: typeof imports.expandPandaCSSProps
    type ParsedStyles = imports.ParsedStyles
}

globalify({ ...imports })
