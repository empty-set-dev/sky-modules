import fs from 'fs'
import path from 'path'

import { Argv } from 'yargs'

export default function init(yargs: Argv): Argv {
    return yargs
        .command(
            'slices',
            'Deploy slices to npmjs.com',
            () => {
                //
            },
            async argv => {

            }
        )
        .completion('completion', 'Generate completion for terminal')
}
