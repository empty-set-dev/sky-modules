import 'sky/platform/node/initial'

import 'sky/standard/EventEmitter/global'

import Console from 'sky/standard/Console'

Console.log = jest.fn()

test('EventEmitter extend', () => {
    const test = EventEmitter.extend<() => void, { test: () => void }>(() => {
        Console.log('I am a function!')
    })

    const callback = (): void => Console.log('test')
    test.on('test', callback)
    test.emit('test')
    test.off('test', callback)

    test()

    expect(Console.log).toHaveBeenNthCalledWith(1, 'test')
    expect(Console.log).toHaveBeenNthCalledWith(2, 'I am a function!')
    expect(Console.log).toHaveBeenCalledTimes(2)
})
