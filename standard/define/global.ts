import './_define'
import './_loadDefines'
import './_plain'
import './_save'
import './_share'
import './_types'

import local from './__local'

async(async () => {
    await switch_thread

    Object.keys(local.defines).forEach(k => {
        if (local.classes[k] == null) {
            throw Error(`class ${k} is defined, but not imported`)
        }

        local.defines[k].Class = local.classes[k]
    })

    Object.keys(local.classes).forEach(k => {
        if (local.defines[k] == null) {
            throw Error(`class ${k} is imported, but not defined`)
        }
    })
})
