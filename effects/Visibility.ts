@define('sky.effects.Visibility')
export class Visibility {
    @boolean
    visible: boolean = true

    static super(self: Visibility): void {
        self.visible = true
    }

    @hook
    protected onAny(
        next: (this: Visibility, event: Sky.Event) => void,
        eventName: string,
        event: Sky.Event
    ): void {
        if (
            eventName === 'beforeUpdate' ||
            eventName === 'update' ||
            eventName === 'afterUpdate' ||
            this.visible
        ) {
            next.call(this, event)
        }
    }
}
