import 'sky/react/initReactSpa'
isRuntime = true

import.meta.hot?.accept(() => {
    Console.debug('hot update')
})
