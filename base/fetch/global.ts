import globalify from 'base/globalify'

import * as module from '.'

globalify({
    fetchJson: module.fetchJson,
    fetchText: module.fetchText,
})

declare global {
    const fetchJson: typeof module.fetchJson
    const fetchText: typeof module.fetchText
}
