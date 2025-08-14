import 'sky/platform/node/global'
import 'sky/standard/global'
import 'sky/features/effect/global'
import { Console.log } from 'sky/utilities/Console2e

Console.log('Hello, World!')

class Test {
    readonly effect: Effect

    constructor(deps: EffectDeps) {
        this.effect = new Effect(deps, this)
    }
}

const root = new EffectsRoot()
const test = new Test(root)
test
