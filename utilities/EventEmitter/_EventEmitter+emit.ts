import EventEmitter from './_EventEmitter'

export default function emit(
    this: EventEmitter,
    ev: Object.Index,
    ...args: unknown[]
): EventEmitter {
    const eventsList = this['__events'][ev]
    eventsList && eventsList.forEach(cb => cb(...args))

    return this
}
