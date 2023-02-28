/* eslint-disable no-console */
import 'base/EventEmitter'

const evEmitter = new EventEmitter()
const dispose = evEmitter.on('test', () => console.log('test event fired once'))
evEmitter.emit('test')
dispose()
evEmitter.emit('test')
