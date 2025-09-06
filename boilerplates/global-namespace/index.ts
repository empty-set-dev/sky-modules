iAm('global-namespace', import('.'))

declare global {
    interface Modules {
        'global-namespace': typeof import('.')
    }
}
