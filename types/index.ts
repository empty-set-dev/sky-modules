import globalify from 'base/globalify'
import local from './default'
export * from './local'
export default local
globalify({ types })

declare global {
    const types: typeof local
}
