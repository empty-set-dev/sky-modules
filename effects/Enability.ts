const EnabilityData = schema('sky.effects.EnabilityData', {
    enability: boolean,
})

@define('sky.effects.Enability')
export default class Enability {
    @object(EnabilityData)
    enability: {
        enabled: boolean
    }

    static super(self: Enability): void {
        self.enability.enabled = true
    }

    constructor() {
        this.enability = { enabled: true }
    }

    @hook
    protected onAny(
        next: (this: Enability, event: Sky.Event) => void,
        eventName: string,
        event: Sky.Event
    ): void {
        if (this.enability.enabled) {
            next.call(this, event)
        }
    }
}

interface Boo extends Enability {}
class Boo {
    enabled: boolean = true
}

interface Foo extends Enability {}
@mixin(Enability)
class Foo extends Boo {}
const foo = new Foo()

foo.enability.enabled
