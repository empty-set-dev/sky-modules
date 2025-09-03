iAm('module', await import('.'))

export * from './_module'
export { default } from './_module'

declare global {
    interface Modules {
        module: typeof import('.')
    }
}
