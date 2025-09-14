iAm('{{GLOBAL_SINGLE_MODULE}}', import('./{{GLOBAL_SINGLE_MODULE}}'))

declare global {
    interface Modules {
        '{{GLOBAL_SINGLE_MODULE}}': typeof import('./{{GLOBAL_SINGLE_MODULE}}')
    }
}

export default 42
