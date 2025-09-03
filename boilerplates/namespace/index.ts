import { iAm } from 'sky/standard/modules'
iAm('namespace', import('.'))

declare global {
    interface Modules {
        namespace: typeof import('.')
    }
}
