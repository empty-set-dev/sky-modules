import define from './define'
import internal from './Internal/Internal'

define('sky.core.loadDefines', loadDefines)
export default async function loadDefines(defines: internal.Defines): Promise<void> {
    Object.keys(defines).forEach(k => {
        internal.loadedDefines[k] = defines[k]
        internal.uniqueId = Math.max(internal.uniqueId, defines[k])
        internal.staticMaxId = internal.uniqueId
    })
}
