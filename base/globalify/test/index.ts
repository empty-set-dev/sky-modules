/* eslint-disable no-console */
import '..'
import * as _ from './test'
globalify(_)
declare global {
    const test: typeof _.test
}
console.log(test)
