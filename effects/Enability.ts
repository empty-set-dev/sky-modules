@define('sky.effects.Enability')
export default class Enability {
    @boolean
    enabled: boolean = true

    static super(self: Enability): void {
        self.enabled = true
    }

    @hook
    protected onAny(
        next: (this: Enability, event: Sky.Event) => void,
        eventName: string,
        event: Sky.Event
    ): void {
        if (this.enabled) {
            next.call(this, event)
        }
    }
}
