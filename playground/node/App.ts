// import '#/imports'
import Console from '@sky-modules/core/Console'
import { Effect, EffectThree } from 'features/effect'

const effect = new Effect(new EffectThree())
console.log(effect)

export default async function App(): Promise<void> {
    Console.success('Hello, world!')
}
