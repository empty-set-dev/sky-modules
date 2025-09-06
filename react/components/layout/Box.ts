iAm('Box', import('./Box'))

declare global {
    interface Modules {
        'Box': typeof import('./Box')
    }
}

export default 42
