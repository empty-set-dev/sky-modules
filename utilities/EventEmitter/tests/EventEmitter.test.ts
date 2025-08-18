import 'sky/utilities/EventEmitter/global'

import Console from 'sky/utilities/Console'

Console.log = jest.fn()

test('EventEmitter', () => {
    const eventEmitter = new EventEmitter()
    const dispose = eventEmitter.on('test', () => Console.log('test event fired once'))
    eventEmitter.emit('test')
    dispose()
    eventEmitter.emit('test')

    expect(Console.log).toHaveBeenCalledWith('test event fired once')
})
