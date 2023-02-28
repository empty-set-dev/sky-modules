/* eslint-disable no-console */

import local from './default'
import globalify from 'base/globalify'

globalify(local)

declare global {
    const test: typeof local.test
}

console.log(test.x === 8)
