import globalify from '@sky-modules/core/globalify'

import * as imports from '../tokens'

declare global {
    const setTokens: typeof imports.setTokens
    const getTokens: typeof imports.getTokens
    const getSemanticColor: typeof imports.getSemanticColor
    const getFoundationColor: typeof imports.getFoundationColor
    const getColor: typeof imports.getColor
    const tokens: typeof imports.tokens
}

globalify({ ...imports })
