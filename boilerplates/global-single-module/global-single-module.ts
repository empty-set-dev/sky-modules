import { iAm } from 'sky/standard/modules'
iAm('global-single-module', import('./global-single-module'))

declare global {
    interface Modules {
        'global-single-module': typeof import('./global-single-module')
    }
}

export default 42
