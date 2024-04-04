import { _ON_DESTROY, _ON_END_LIST } from './--'

export default function _signalEnd(this: Effects): void {
    this[_ON_DESTROY] = true

    if (!this[_ON_END_LIST]) {
        return
    }

    this[_ON_END_LIST].forEach(onEnd => onEnd(true))

    delete this[_ON_END_LIST]
}
