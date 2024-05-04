import EventEmitter from './-EventEmitter'

export default function emit(this: EventEmitter, ev: Object.Index, ...args: unknown[]): void {
    const eventsList = this['__events'][ev]
    eventsList && eventsList.forEach(cb => cb(...args))
}
