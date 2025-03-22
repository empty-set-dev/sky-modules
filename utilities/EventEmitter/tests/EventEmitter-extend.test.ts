/* eslint-disable no-console */
import '../global'

console.log = jest.fn()

test('EventEmitter extend', () => {
    const test = EventEmitter.extend(() => {
        console.log('I am a function!')
    })

    const dispose = test.on('test', () => console.log('test'))
    test.emit('test')
    dispose()

    test()

    expect(console.log).toHaveBeenNthCalledWith(1, 'test')
    expect(console.log).toHaveBeenNthCalledWith(2, 'I am a function!')
    expect(console.log).toHaveBeenCalledTimes(2)
})
