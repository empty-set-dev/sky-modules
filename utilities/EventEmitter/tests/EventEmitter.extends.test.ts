import 'sky/utilities/EventEmitter/global'

import Console from 'sky/utilities/Console'

Console.log = jest.fn()

test('EventEmitter extends', () => {
    class Test extends EventEmitter {}
    const test = new Test()
    const dispose = test.on('test', () => Console.log('test event fired once'))
    test.emit('test')
    dispose()
    test.emit('test')

    expect(Console.log).toHaveBeenCalledWith('test event fired once')
})
