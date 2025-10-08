import { invokeCallback } from 'core/Callback'

export type WhenResult<T> =
    T extends Promise<T> ? T : T extends new (...args: infer A) => infer I ? I : T

export function when<T extends object | object[], A extends unknown[]>(
    object: T,
    callback?: Callback<[WhenResult<T>, ...A], void | Promise<void>>,
    ...args: A
): ReturnType<typeof task<[], WhenResult<T>>> {
    return task(async () => {
        if (Array.isArray(object)) {
            const result = (await Promise.all(
                object.map(value =>
                    task(async () => {
                        let result: object

                        if (value.whenCreate != null) {
                            result = await value.whenCreate
                        } else {
                            const promise = value
                            result = (await promise) as object
                        }

                        return result
                    })
                )
            )) as WhenResult<T>
            if (callback) await invokeCallback(callback, result, ...args)
            return result
        }

        as<{ [Symbol.asyncCreate]: Promise<WhenResult<T>> } & Promise<WhenResult<T>>>(object)

        let result: WhenResult<T>

        if (object[Symbol.asyncCreate] != null) {
            result = await object[Symbol.asyncCreate]
        } else {
            const promise = object
            result = (await promise) as WhenResult<T>
        }

        callback && (await callback(result, ...args))
        return result
    })
}
