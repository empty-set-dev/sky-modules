@define('sky.effects.VisibilityMixin')
export class VisibilityMixin {
    @boolean
    visible: boolean = true

    static super(self: VisibilityMixin): void {
        self.visible = true
    }

    @hook
    protected onAny(
        next: (this: VisibilityMixin, event: Sky.Event) => void,
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
