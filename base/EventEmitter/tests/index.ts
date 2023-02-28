/* eslint-disable no-console */
import 'base/EventEmitter'

const evEmitter = new EventEmitter()
evEmitter.on('test', () => console.log('test event fired'))
evEmitter.emit('test')
