import globalify from 'utilities/globalify'

import * as module from '.'

globalify({
    useEventListener: module.useEventListener,
    useInterval: module.useInterval,
})

declare global {
    const useEventListener: typeof module.useEventListener
    const useInterval: typeof module.useInterval
}
