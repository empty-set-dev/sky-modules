iAm('Plugin', import('.'))

declare global {
    interface Modules {
        'Plugin': typeof import('.')
    }
}

export { default } from './_Plugin'
export * from './_Plugin'
