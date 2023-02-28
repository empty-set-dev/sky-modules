import globalify from 'base/globalify'
import local from './default'
globalify({ types: local })
export * from './local'
export default local

declare global {
    const types: typeof local
}
