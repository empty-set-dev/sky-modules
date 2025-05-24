import globalify from 'sky/utilities/globalify'

import * as module from '.'

globalify({ Sprite: module.default })

declare global {
    class Sprite extends module.default {}
}
