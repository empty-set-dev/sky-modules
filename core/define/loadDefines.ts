import define from './define'
import Internal from './internal/internal'

define('sky.core.loadDefines', loadDefines)
export default async function loadDefines(defines: Internal.Defines): Promise<void> {
    Object.keys(defines).forEach(k => {
        Internal.loadedDefines[k] = defines[k]
        Internal.uniqueId = Math.max(Internal.uniqueId, defines[k])
        Internal.staticMaxId = Internal.uniqueId
    })
}
