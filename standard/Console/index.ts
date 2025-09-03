import 'sky/standard/modules'
import 'sky/standard/define/global'
iAm('sky.standard.Console', import('.'))

declare global {
    interface Modules {
        'sky.standard.Console': typeof import('.')
    }
}

export { default } from './_Console'
export * from './_consoleColors'
