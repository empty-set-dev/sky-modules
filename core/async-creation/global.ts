import globalify from '../globalify'

import * as imports from '.'

declare global {
    type WhenResult<T> = imports.WhenResult<T>
    const when: typeof imports.when
    const init: typeof imports.init
}

globalify(imports)
