import globalify from '@sky-modules/core/globalify'

import * as imports from './async-creation'

declare global {
    const when: typeof imports.when
    type WhenResult<T> = imports.WhenResult<T>
}

globalify({ ...imports })
