import { iAm } from 'sky/standard/modules'
iAm('sky.platform.web.media', import('.'))

const a = getModule('sky.platform.web.media')
console.log(a)

declare global {
    interface Modules {
        'sky.platform.web.media': typeof import('.')
    }
}

export { default } from './_media'
export * from './_media'
