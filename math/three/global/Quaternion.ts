import globalify from '@sky-modules/core/globalify'

import * as imports from '../Quaternion'

declare global {
    const Quaternion: typeof imports.Quaternion
}

globalify({ ...imports })
