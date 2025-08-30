import 'sky/platform/node/initial'

import 'sky/utilities/EventEmitter/global'

import Console from 'sky/utilities/Console'

Console.log = jest.fn()

test('EventEmitter', () => {
    const eventEmitter = new EventEmitter<{ test: () => void }>()
    const callback = (): void => Console.log('test event fired once')
    eventEmitter.on('test', callback)
    eventEmitter.emit('test')
    eventEmitter.off('test', callback)
    eventEmitter.emit('test')

    expect(Console.log).toHaveBeenCalledWith('test event fired once')
})
