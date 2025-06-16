/* eslint-disable no-console */
import 'sky/utilities/EventEmitter/global'

console.log = jest.fn()

test('EventEmitter extends', () => {
    class Test extends EventEmitter {}
    const test = new Test()
    const dispose = test.on('test', () => console.log('test event fired once'))
    test.emit('test')
    dispose()
    test.emit('test')

    expect(console.log).toHaveBeenCalledWith('test event fired once')
})
