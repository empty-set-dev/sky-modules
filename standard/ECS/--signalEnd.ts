import { _ON_DESTROY, _ON_END_LIST } from './--'

export default function _signalEnd(this: Effects): void {
    this[_ON_DESTROY] = true

    if (!this[_ON_END_LIST]) {
        return
    }

    for (let i = 0; i < this[_ON_END_LIST].length; i++) {
        this[_ON_END_LIST][i](true)
    }

    delete this[_ON_END_LIST]
}
