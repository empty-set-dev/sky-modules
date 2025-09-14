// [ ] static hooks
@define('sky.effects.Enability')
export default class Enability {
    @hook static onAny(
        this: Enability,
        next: (this: Enability, event: Sky.Event) => void,
        eventName: string,
        event: Sky.Event
    ): void {
        if (this.enabled) {
            next.call(this, event)
        }
    }

    @boolean
    enabled: boolean

    static super(self: Enability): void {
        self.enabled ??= true
    }

    constructor() {
        this.enabled ??= true
    }
}
