import globalify from '@sky-modules/core/globalify'

import transformWindowCoordinates, * as imports from '../transformWindowCoordinates'

declare global {
    const transformWindowCoordinates: typeof imports.default
    type transformWindowCoordinates = typeof imports.default
}

globalify({ transformWindowCoordinates })
