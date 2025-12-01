/**
 * Enumeration of reactive event types.
 *
 * These events are emitted when reactive objects undergo lifecycle changes.
 */
export enum ReactiveEventType {
    /** Object was created */
    NEW = 0,
    /** Object was disposed/destroyed */
    DISPOSE = 1,
    /** Object properties were updated */
    update = 2,
    /** Object properties were deleted */
    delete = 3,
}

/**
 * Base interface for all reactive events.
 *
 * All reactive event types extend this interface with specific event data.
 */
export interface ReactiveEvent {
    /** The type of reactive event that occurred */
    type:
        | ReactiveEventType.create
        | ReactiveEventType.destroy
        | ReactiveEventType.update
        | ReactiveEventType.delete
}

/**
 * Event emitted when a new reactive object is created.
 *
 * @template T The type of data contained in the created object
 */
export interface ReactiveNewEvent<T> extends ReactiveEvent {
    /** Event type marker */
    new: ReactiveEventType.new
    /** Unique identifier for the created object */
    id: number
    /** The data contained in the newly created object */
    data: T
}

/**
 * Event emitted when a reactive object is destroyed.
 */
export interface ReactiveDestroyEvent extends ReactiveEvent {
    /** Event type marker */
    type: ReactiveEventType.destroy
    /** Unique identifier for the destroyed object */
    id: number
}

/**
 * Event emitted when a reactive object's properties are updated.
 *
 * @template T The type of data contained in the updated object
 */
export interface ReactiveUpdateEvent<T> extends ReactiveEvent {
    /** Event type marker */
    type: ReactiveEventType.update
    /** Unique identifier for the updated object */
    id: number
    /** The updated data */
    data: T
}

/**
 * Event emitted when properties are deleted from a reactive object.
 */
export interface ReactiveDeleteEvent extends ReactiveEvent {
    /** Event type marker */
    type: ReactiveEventType.delete
    /** Unique identifier for the object */
    id: number
    /** Array of property keys that were deleted */
    keys: string[]
}
