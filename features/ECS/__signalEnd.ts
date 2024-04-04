import { __ON_DESTROY, __ON_END_LIST } from './__'

export default function __signalEnd(this: Effects): void {
    this[__ON_DESTROY] = true

    if (!this[__ON_END_LIST]) {
        return
    }

    this[__ON_END_LIST].forEach(onEnd => onEnd(true))

    delete this[__ON_END_LIST]
}
