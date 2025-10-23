import globalify from '@sky-modules/core/globalify'

import Table, * as imports from './Table'

declare global {
    const Table: typeof imports.default
    type Table = typeof imports.default
    type TableProps = imports.TableProps
}

globalify({ Table, ...imports })
