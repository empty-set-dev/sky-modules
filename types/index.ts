import local from './default'
import globalify from 'base/globalify'

globalify({ types: local })

export * from './local'
export default local

declare global {
    const types: typeof local
}
