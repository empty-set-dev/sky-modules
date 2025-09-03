import { iAm } from 'sky/standard/modules'
iAm('global-module', import('.'))

declare global {
    interface Modules {
        'global-module': typeof import('.')
    }
}

export * from './_global-module'
export { default } from './_global-module'
