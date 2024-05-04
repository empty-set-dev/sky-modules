import EventEmitter from './-EventEmitter'

export default function on(this: EventEmitter, ev: Object.Index, callback: Function): () => void {
    const eventsList = (this['__events'][ev] ??= [])

    eventsList.push(callback)
    return () => eventsList.remove(callback)
}
