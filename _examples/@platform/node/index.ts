import 'sky/@node/global'
import { logConsole } from 'sky/helpers/console'

logConsole('Hello, World!')

setTimeout(() => {
    logConsole('Timeout')
}, 1000)
