import 'sky/utilities/EventEmitter/global'

import Console from 'sky/utilities/Console'

Console.log = jest.fn()

test('EventEmitter extend', () => {
    const test = EventEmitter.extend(() => {
        Console.log('I am a function!')
    })

    const dispose = test.on('test', () => Console.log('test'))
    test.emit('test')
    dispose()

    test()

    expect(Console.log).toHaveBeenNthCalledWith(1, 'test')
    expect(Console.log).toHaveBeenNthCalledWith(2, 'I am a function!')
    expect(Console.log).toHaveBeenCalledTimes(2)
})
