import 'sky/platform/node/initial'

import 'sky/core/EventEmitter/global'

import Console from 'sky/core/Console'

Console.log = jest.fn()

test('EventEmitter extends', () => {
    class Test extends EventEmitter<{ test: () => void }> {}
    const test = new Test()
    const callback = (): void => Console.log('test event fired once')
    test.on('test', callback)
    test.emit('test')
    test.off('test', callback)
    test.emit('test')

    expect(Console.log).toHaveBeenCalledWith('test event fired once')
})
