import globalify from '@sky-modules/core/globalify'

import * as lib from '.'

declare global {
    type WhenResult<T> = lib.WhenResult<T>
    const when: typeof lib.when
    const init: typeof lib.init
}

globalify(lib)
