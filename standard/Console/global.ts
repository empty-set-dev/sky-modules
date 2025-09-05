import globalify from 'sky/standard/globalify'

import Console from '../Console'

declare global {
    const Console: (typeof import('../Console'))['default']
    interface Console {
        success(...args: Parameters<Console['log']>): void
    }
}

Object.assign(console, Console)
globalify({ Console: console })
