iAm('global-module', import('.'))

declare global {
    interface Modules {
        'global-module': typeof import('.')
    }
}

export { default } from './_global-module'
export * from './_global-module'
