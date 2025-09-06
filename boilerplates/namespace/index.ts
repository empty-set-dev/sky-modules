iAm('namespace', import('.'))

declare global {
    interface Modules {
        namespace: typeof import('.')
    }
}
