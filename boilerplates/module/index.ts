import { iAm } from 'sky/standard/modules'
iAm('module', import('.'))

declare global {
    interface Modules {
        module: typeof import('.')
    }
}

export * from './_module'
export { default } from './_module'
