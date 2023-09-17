import globalify from 'base/globalify/defaultly'

import * as local from './defaultly'

globalify({
    fetchJson: local.fetchJson,
    fetchText: local.fetchText,
})

declare global {
    const fetchJson: typeof local.fetchJson
    const fetchText: typeof local.fetchText
}
