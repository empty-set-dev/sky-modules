export {}

declare global {
    interface on {
        (entity: Entity | Effect, event: 'Frame', callback: (dt: time) => void): void
    }

    interface Effects {
        emit(event: 'Frame', dt: time): void
    }
}
