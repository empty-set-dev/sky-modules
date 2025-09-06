iAm('sky.react.providers.media', import('.'))

declare global {
    interface Modules {
        'sky.react.providers.media': typeof import('.')
    }
}

export { default } from './_media'
export * from './_media'
