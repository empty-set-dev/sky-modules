import { invokeCallback } from 'core/Callback'

type Awaitable<T> = Promise<T> | { whenReady: Promise<T> }

export type WhenResult<T> = T extends readonly unknown[]
    ? { [K in keyof T]: T[K] extends Awaitable<infer U> ? U : never }
    : T extends Awaitable<infer U>
      ? U
      : never

export function when<
    T extends Awaitable<unknown> | readonly Awaitable<unknown>[],
    A extends unknown[],
>(
    object: T,
    callback?: Callback<[WhenResult<T>, ...A], void | Promise<void>>,
    ...args: A
): PromiseLike<WhenResult<T>> {
    return task(async () => {
        if (Array.isArray(object)) {
            const result = (await Promise.all(
                object.map(async value => {
                    return value.whenReady != null ? await value.whenReady : await value
                })
            )) as WhenResult<T>
            callback && (await invokeCallback(callback, result, ...args))
            return result
        }

        as<Promise<T>>(object)
        as<{ whenReady: Promise<T> }>(object)
        const result = (
            object.whenReady != null ? await object.whenReady : await object
        ) as WhenResult<T>
        callback && (await invokeCallback(callback, result, ...args))
        return result
    })
}

export async function init<T extends { init(...args: A): Promise<void> }, A extends unknown[]>(
    instance: T,
    ...args: A
): Promise<T> {
    await instance.init(...args)
    return instance
}
