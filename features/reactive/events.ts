export enum ReactiveEventType {
    NEW = 0,
    DISPOSE = 1,
    update = 2,
    delete = 3,
}

export interface ReactiveEvent {
    type:
        | ReactiveEventType.create
        | ReactiveEventType.destroy
        | ReactiveEventType.update
        | ReactiveEventType.delete
}

export interface ReactiveNewEvent<T> extends ReactiveEvent {
    new: ReactiveEventType.new
    id: number
    data: T
}

export interface ReactiveDestroyEvent extends ReactiveEvent {
    type: ReactiveEventType.destroy
    id: number
}

export interface ReactiveUpdateEvent<T> extends ReactiveEvent {
    type: ReactiveEventType.update
    id: number
    data: T
}

export interface ReactiveDeleteEvent extends ReactiveEvent {
    type: ReactiveEventType.delete
    id: number
    keys: string[]
}
