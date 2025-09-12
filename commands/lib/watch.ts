import fs from 'fs'

import Console, { gray, reset } from './Console'
import { runState } from './run'

const fileWatchers: fs.FSWatcher[] = []

export default function watch(filePaths: string[]): void {
    for (const filePath of filePaths) {
        if (!fs.existsSync(filePath)) {
            continue
        }

        fileWatchers.push(
            fs.watch(
                filePath,
                {
                    recursive: true,
                },
                () => {
                    Console.clear()
                    Console.debug(`${gray}env changed, restart${reset}`)
                    runState.restart && runState.restart()
                }
            )
        )
    }
}

export function unwatch(): void {
    for (const fileWatcher of fileWatchers) {
        fileWatcher.close()
    }
}
