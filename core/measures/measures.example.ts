import './global'
import Console from '@sky-modules/core/Console'

const time1 = (1).seconds
const time2 = (1).asMinutes
const time = (time1.inSeconds + time2.inSeconds).seconds
Console.log(time) //61 seconds
