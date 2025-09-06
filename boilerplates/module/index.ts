iAm('module', import('.'))

declare global {
    interface Modules {
        module: typeof import('.')
    }
}

export { default } from './_module'
export * from './_module'
