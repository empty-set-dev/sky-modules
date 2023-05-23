import local_axios from './defaultly'
import 'base/globalify'

globalify({ axios: local_axios })

declare global {
    const axios: typeof local_axios
}
