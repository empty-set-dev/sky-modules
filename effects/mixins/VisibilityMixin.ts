/**
 * Mixin providing visibility-based event filtering
 *
 * Adds a `visible` property that gates rendering-related events.
 * When invisible, only update-related events (beforeUpdate, update, afterUpdate)
 * are processed. Other events (like render) are blocked.
 *
 * Use with `@mixin` decorator on target class.
 *
 * @example Basic usage
 * ```typescript
 * @mixin(VisibilityMixin)
 * class MyRenderable {
 *     readonly effect: Effect
 *
 *     constructor() {
 *         VisibilityMixin.super(this)
 *     }
 *
 *     protected onRender() {
 *         // Only called when visible
 *     }
 * }
 * ```
 *
 * @example Toggle visibility
 * ```typescript
 * const renderable = new MyRenderable([effect])
 * renderable.visible = false // Hide (skip render events)
 * renderable.visible = true  // Show (process render events)
 * ```
 */
@define('sky.effects.VisibilityMixin')
export class VisibilityMixin {
    /** Visibility flag for event filtering */
    @boolean
    visible: boolean = true

    /**
     * Initialize mixin for class instance
     *
     * @param self - Instance to initialize
     */
    static super(self: VisibilityMixin): void {
        self.visible = true
    }

    /**
     * Hook to filter events based on visibility
     *
     * Always allows update events, blocks other events when invisible.
     *
     * @param next - Next event handler in chain
     * @param eventName - Name of the event
     * @param event - Event object
     */
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
