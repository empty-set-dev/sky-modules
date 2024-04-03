/* eslint-disable no-console */
import 'utilities/EventEmitter/EventEmitter.global'

class Test extends EventEmitter {}
const test = new Test()
const dispose = test.on('test', () => console.log('test event fired once'))
test.emit('test')
dispose()
test.emit('test')
