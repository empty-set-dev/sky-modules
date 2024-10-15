/* eslint-disable no-console */
import 'helpers/EventEmitter/global'

console.log = jest.fn()

test('EventEmitter', () => {
    const eventEmitter = new EventEmitter()
    const dispose = eventEmitter.on('test', () => console.log('test event fired once'))
    eventEmitter.emit('test')
    dispose()
    eventEmitter.emit('test')

    expect(console.log).toHaveBeenCalledWith('test event fired once')
})
