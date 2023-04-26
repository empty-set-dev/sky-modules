import globalify from 'base/globalify'

import local from './default'

globalify(local)

export * from './local'
export default local

declare global {
    type bind = local.bind
    const bind: typeof local.bind
}
