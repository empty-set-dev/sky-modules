import globalify from '@sky-modules/core/globalify'

import Sprite, * as imports from '../Sprite'

declare global {
    const Sprite: typeof imports.default
    type Sprite = typeof imports.default
}

globalify({ Sprite })
