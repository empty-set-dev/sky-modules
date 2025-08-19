import './Array/global'
import './bind/global'
import './fetch/global'
import './Math/global'
import './measures/global'
import './Object/global'
import './Promise/global'
import './assert'
import './async'
import './events'
import './hooks'
import './is'
import './mixin'
import './NullError'
import './onAsyncError'
import './repeat'
import './switch_thread'

declare global {
    var isRuntime: boolean
}

async(async () => {
    global.isRuntime = false
    await switch_thread
    global.isRuntime = true
})
