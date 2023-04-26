/* eslint-disable no-console */
import globalify from 'base/globalify/defaultly'

import local from './defaultly'

globalify(local)

declare global {
    const test: typeof local.test
}

console.log(test.x === 8)
