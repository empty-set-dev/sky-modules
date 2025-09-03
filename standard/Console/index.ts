import 'sky/standard/modules'
import 'sky/standard/define/global'
iAm('sky.standard.Console', await import('.'))

export { default } from './_Console'
export * from './_consoleColors'

declare global {
    interface Modules {
        'sky.standard.Console': typeof import('.')
    }
}
