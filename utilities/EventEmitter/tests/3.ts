/* eslint-disable no-console */
import 'utilities/EventEmitter.global'

class Test {
    constructor() {
        EventEmitter.extend(this)
        console.log('I am object')
    }

    foo(): void {
        console.log('foo')
    }
}

const test = new Test()
const dispose = test.on('test', () => console.log('test'))
test.emit('test')
dispose()

test.foo()
