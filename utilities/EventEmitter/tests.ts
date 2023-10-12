/* eslint-disable no-console */
import 'modules/imports'
import 'utilities/EventEmitter/global'

const eventEmitter = new EventEmitter()
const dispose = eventEmitter.on('test', () => console.log('test event fired once'))
eventEmitter.emit('test')
dispose()
eventEmitter.emit('test')
