import globalify from 'utilities/globalify'
import * as module from './idle'

globalify({ idle: module.default })

declare global {
    const idle: (timeout: number) => Promise<void>
}
