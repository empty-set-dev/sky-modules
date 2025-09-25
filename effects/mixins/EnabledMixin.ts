// [ ] static hooks
@define('sky.effects.EnabledMixin')
export default class EnabledMixin {
    @boolean
    enabled: boolean

    static super(self: EnabledMixin): void {
        self.enabled ??= true
    }

    constructor() {
        this.enabled ??= true
    }

    @hook static onAny(
        this: EnabledMixin,
        next: (this: EnabledMixin, event: Sky.Event) => void,
        eventName: string,
        event: Sky.Event
    ): void {
        if (this.enabled) {
            next.call(this, event)
        }
    }
}
