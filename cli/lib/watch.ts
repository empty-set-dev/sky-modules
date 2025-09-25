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
                () => {
                    // Console.clear()
                    Console.debug(`${gray}env changed, restart${reset}`)
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
