import './_define'
import './_loadDefines'
import './_plain'
import './_reaction'
import './_save'
import './_share'
import './_types'

import '../runtime'
import '../async'

import local from './__local'

async(async () => {
    await runtime

    Object.keys(local.loadedDefines).forEach(k => {
        if (local.defines[k] == null) {
            throw Error(`define ${k} is defined, but not imported`)
        }

        local.defines[k].value[local.idSymbol] = local.loadedDefines[k]
    })

    Object.keys(local.defines).forEach(k => {
        if (local.loadedDefines[k] == null) {
            throw Error(`define ${k} is imported, but not defined`)
        }
    })
})
