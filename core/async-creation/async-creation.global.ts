import globalify from '@sky-modules/core/globalify'
import * as imports from './async-creation'

declare global {
    const when: typeof imports.when
    const WhenResult: typeof imports.WhenResult
}

globalify({ ...imports })
