import globalify from '@sky-modules/core/globalify'

import * as imports from '../parsing'

declare global {
    const kebabToCamel: typeof imports.kebabToCamel
    const normalizeProperties: typeof imports.normalizeProperties
    const parseUnit: typeof imports.parseUnit
    const parsePadding: typeof imports.parsePadding
    const parseBoxShadow: typeof imports.parseBoxShadow
    const parseTextShadow: typeof imports.parseTextShadow
    const parseBorderRadius: typeof imports.parseBorderRadius
    type ParsedShadow = imports.ParsedShadow
    type ParsedSpacing = imports.ParsedSpacing
}

globalify({ ...imports })
