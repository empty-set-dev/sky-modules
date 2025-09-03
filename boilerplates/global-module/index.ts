iAm('global-module', await import('.'))

export * from './_global-module'
export { default } from './_global-module'

declare global {
    interface Modules {
        'global-module': typeof import('.')
    }
}
