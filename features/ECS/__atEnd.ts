import { __ON_END_LIST } from './__'
import __signalEnd from './__signalEnd'

export default function __atEnd<R, A extends unknown[]>(
    link: Link,
    onEnd: (...args: [] | A) => R
): Effect<R, A> {
    const [resolve, end] = createPromise<Awaited<R>>()

    const self = {
        link,
        resolve,
        end,
        async dispose(...args: A): Promise<Awaited<R>> {
            __signalEnd.call(this)

            const result = await onEnd(...args)

            if (!this[__ON_END_LIST]) {
                return
            }

            for (let i = 0; i < this[__ON_END_LIST].length; i++) {
                await this[__ON_END_LIST][i](false)
            }

            delete this[__ON_END_LIST]

            return resolve(result)
        },
    }

    link[__ON_END_LIST] ??= []
    link[__ON_END_LIST].push(async (isSignalEnd: boolean) => {
        if (isSignalEnd) {
            __signalEnd.call(self)
            return
        }

        const result = await onEnd()

        if (!self[__ON_END_LIST]) {
            return
        }

        for (let i = 0; i < self[__ON_END_LIST].length; i++) {
            await self[__ON_END_LIST][i](false)
        }

        delete self[__ON_END_LIST]

        return resolve(result)
    })

    return self as never
}
