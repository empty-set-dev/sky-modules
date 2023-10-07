import globalify from 'utilities/globalify'

import * as module from '.'

globalify({ useInterval: module.useInterval })

declare global {
    const useInterval: typeof module.useInterval
}
