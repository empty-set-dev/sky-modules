import 'sky/platform/node/global'
import 'sky/standard/global'
import 'sky/features/effect/global'
import { logConsole } from 'sky/utilities/console'

logConsole('Hello, World!')

class Test {
    readonly effect: Effect

    constructor(deps: EffectDeps) {
        this.effect = new Effect(deps, this)
    }
}

const root = new EffectsRoot()
const test = new Test(root)
test
