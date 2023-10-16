import { _ON_END_LIST } from './--'
import _signalEnd from './--signalEnd'

export default function _atEnd<R, A extends unknown[]>(
    link: Effects,
    onEnd: (...args: [] | A) => R
): Effect<R, A> {
    const [resolve, end] = promise<Awaited<R>>()

    const self = {
        resolve,
        end,
        async dispose(...args: A): Promise<Awaited<R>> {
            _signalEnd.call(this)

            const result = await onEnd(...args)

            if (!this[_ON_END_LIST]) {
                return
            }

            for (let i = 0; i < this[_ON_END_LIST].length; i++) {
                await this[_ON_END_LIST][i](false)
            }

            delete this[_ON_END_LIST]

            return resolve(result)
        },
    }

    link[_ON_END_LIST] ??= []
    link[_ON_END_LIST].push(async (isSignalEnd: boolean) => {
        if (isSignalEnd) {
            _signalEnd.call(self)
            return
        }

        const result = await onEnd()

        if (!self[_ON_END_LIST]) {
            return
        }

        for (let i = 0; i < self[_ON_END_LIST].length; i++) {
            await self[_ON_END_LIST][i](false)
        }

        delete self[_ON_END_LIST]

        return resolve(result)
    })

    return self as never
}
