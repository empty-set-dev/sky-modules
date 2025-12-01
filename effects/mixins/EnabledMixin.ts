/**
 * Mixin providing enable/disable functionality
 *
 * Adds an `enabled` property that gates all event handlers.
 * When disabled, no events are processed (except lifecycle events).
 *
 * Use with `@mixin` decorator on target class.
 *
 * @example Basic usage
 * ```typescript
 * @mixin(EnabledMixin)
 * class MyController {
 *     readonly effect: Effect
 *     // ...
 * }
 *
 * const controller = new MyController([effect])
 * controller.enabled = false // Disable all event handling
 * ```
 *
 * @example With initialization
 * ```typescript
 * @mixin(EnabledMixin)
 * class MySystem {
 *     constructor() {
 *         EnabledMixin.super(this) // Initialize enabled property
 *     }
 * }
 * ```
 */
// [ ] static hooks
@define('sky.effects.EnabledMixin')
export default class EnabledMixin {
    /** Enable/disable flag for event processing */
    @boolean
    enabled: boolean

    /**
     * Initialize mixin for class instance
     *
     * @param self - Instance to initialize
     */
    static super(self: EnabledMixin): void {
        self.enabled ??= true
    }

    constructor() {
        this.enabled ??= true
    }

    /**
     * Hook to gate all events based on enabled state
     *
     * @param next - Next event handler in chain
     * @param eventName - Name of the event
     * @param event - Event object
     */
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
