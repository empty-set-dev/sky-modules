import fs from 'fs'

import __loadSkyConfig, { __getModuleConfig } from './__loadSkyConfig'

export default function __getEntry(name: string): undefined | string {
    const skyConfig = __loadSkyConfig()
    const skyModuleConfig = __getModuleConfig(name, skyConfig)

    if (exists(skyModuleConfig.entry)) {
        return skyModuleConfig.entry
    }

    throw new Error(`no entry:\n  ${skyModuleConfig.entry}`)
}

function exists(filePath: string): boolean {
    return fs.existsSync(filePath)
}
