import { __ON_DESTROY, __LINKS } from './__'

export default function __signalOnDestroy<T, A extends unknown[]>(link: Link<T, A>): void {
    link[__ON_DESTROY] = true

    if (!link[__LINKS]) {
        return
    }

    link[__LINKS].forEach(__signalOnDestroy)
}
