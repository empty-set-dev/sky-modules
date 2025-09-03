iAm('global-namespace', await import('.'))

export {}

declare global {
    interface Modules {
        'global-namespace': typeof import('.')
    }
}
