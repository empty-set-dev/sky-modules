/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const fs = require('fs')
const path = require('path')

/**
 *
 * @param {undefined|string} name
 * @returns {{include: string[], compilerOptions: {paths: Object<string, string[]>}}}
 */
module.exports = function loadTsConfig(name) {
    const exists = fs.existsSync('tsconfig.json')
    const nameExists = fs.existsSync(path.resolve(name ?? '', 'tsconfig.json'))
    if (!exists && !nameExists) {
        // eslint-disable-next-line no-console
        console.error('missing "tsconfig.json"')
        return
    }

    return JSON.parse(
        fs.readFileSync(
            nameExists ? path.resolve(name ?? '', 'tsconfig.json') : 'tsconfig.json',
            'utf-8'
        )
    )
}
