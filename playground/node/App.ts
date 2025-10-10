import '#/imports'

import Console from '@sky-modules/core/Console'
import { Effect, EffectThree } from 'features/effect'

const root = new EffectThree()
const effect = new Effect(root)
root.

export default async function App(): Promise<void> {
    Console.success('Hello, world!')
}
