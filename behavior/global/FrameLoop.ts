import globalify from '@sky-modules/core/globalify'

import FrameLoop, * as imports from '../FrameLoop'

declare global {
    const FrameLoop: typeof imports.default
    type FrameLoop = typeof imports.default
    const onFrame: typeof imports.onFrame
    const frameLoop: typeof imports.frameLoop
}

globalify({ FrameLoop, ...imports })
