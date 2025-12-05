import globalify from '@sky-modules/core/globalify'

import * as imports from '../Sky.PerspectiveCamera'

declare global {
    const PerspectiveCamera: typeof imports.PerspectiveCamera
}

globalify({ ...imports })
