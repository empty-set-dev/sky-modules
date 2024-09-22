import EventEmitter from './_EventEmitter'

export default function on(this: EventEmitter, ev: Object.Index, callback: Function): () => void {
    const eventsList = (this['__events'][ev] ??= [])

    eventsList.push(callback as never)
    return () => eventsList.remove(callback)
}
