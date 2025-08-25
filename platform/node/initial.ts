import cluster from 'cluster'
import util from 'util'

import Console from 'sky/utilities/Console'
import globalify from 'sky/utilities/globalify'

declare global {
    const run: typeof lib.run
}

namespace lib {
    export async function run(callback: () => void | Promise<void>): Promise<void> {
        isRuntime = true
        await runtime
        await callback()
    }

    util.inspect.defaultOptions.depth = 3
    util.inspect.defaultOptions.compact = false
    util.inspect.defaultOptions.getters = true
    util.inspect.defaultOptions.numericSeparator = true

    util.inspect.styles.undefined = 'gray'
    util.inspect.styles.null = 'gray'

    util.inspect.styles.bigint = 'yellowBright'
    util.inspect.styles.boolean = 'yellowBright'
    util.inspect.styles.number = 'yellowBright'

    util.inspect.styles.string = 'greenBright'
    util.inspect.styles.date = 'greenBright'

    util.inspect.styles.module = 'underline'
    util.inspect.styles.regexp = 'redBright'
    util.inspect.styles.symbol = 'magentaBright'
    util.inspect.styles.special = 'cyanBright'

    if (cluster.isPrimary) {
        Console.clear()
    }
}

globalify(lib)
