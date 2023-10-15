import { ON_DESTROY, ON_END_LIST } from './-'

export function _signalEnd(this: Effects): void {
    this[ON_DESTROY] = true

    if (!this[ON_END_LIST]) {
        return
    }

    for (let i = 0; i < this[ON_END_LIST].length; i++) {
        this[ON_END_LIST][i](true)
    }
}
