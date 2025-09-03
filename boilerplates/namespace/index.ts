iAm('namespace', await import('.'))

export {}

declare global {
    interface Modules {
        namespace: typeof import('.')
    }
}
