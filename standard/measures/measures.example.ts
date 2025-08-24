import './global'
import Console from 'sky/utilities/Console'

const time1 = (1).asSeconds
const time2 = (1).asMinutes
const time = (time1.inSeconds + time2.inSeconds).asSeconds
Console.log(time) //61 seconds
