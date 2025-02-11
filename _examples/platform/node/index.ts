import 'sky/platform/node/global'
import { logConsole } from 'sky/helpers/console'

logConsole('Hello, World!', process.env.PUBLIC_ENV__DOMAIN)

setTimeout(() => {
    logConsole('Timeout')
}, 1000)
