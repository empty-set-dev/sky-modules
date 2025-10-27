import fs from 'fs'

import Console, { gray, reset } from './Console'
import { runState } from './run'

namespace local {
    export let fileWatchers: fs.FSWatcher[] = []
}

export default function watch(filePaths: string[]): void {
    for (const filePath of filePaths) {
        if (!fs.existsSync(filePath)) {
            continue
        }

        local.fileWatchers.push(
            fs.watch(
                filePath,
                {
                    recursive: true,
                },
                (_, fileName) => {
                    if (
                        fileName?.startsWith('.dev') ||
                        fileName === 'package.json' ||
                        fileName === 'taconfig.json'
                    ) {
                        return
                    }

                    Console.clear()
                    Console.debug(`${gray}configuration changed, restart${reset}`, `(${fileName})`)
                    runState.restart && runState.restart()
                    setTimeout(() => {
                        unwatch()
                        watch(filePaths)
                    }, 0)
                }
            )
        )
    }
}

export function unwatch(): void {
    for (const fileWatcher of local.fileWatchers) {
        fileWatcher.close()
    }

    local.fileWatchers = []
}
