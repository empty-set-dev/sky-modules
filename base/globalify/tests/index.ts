/* eslint-disable no-console */
import globalify from 'base/globalify'
import local from './default'
globalify(local)

declare global {
    const test: typeof local.test
}

console.log(test.x === 8)
