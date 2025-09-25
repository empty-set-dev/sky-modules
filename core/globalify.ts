iAm('globalify', import('./globalify'))

declare global {
    interface Modules {
        'globalify': typeof import('./globalify')
    }
}

export default 42
