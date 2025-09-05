iAm('sky.standard.MODE', import('.'))

declare global {
    interface Modules {
        'sky.standard.MODE': typeof import('.')
    }
}

export { default } from './_MODE'
export * from './_MODE'
