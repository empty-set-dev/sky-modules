import '#/imports'
import Console from '@sky-modules/core/Console'
import BaseOfEffect from '@sky-modules/features/effect/internal/BaseOfEffect'

class Effect extends BaseOfEffect {}

const effect = new Effect()
console.log(effect)

export default async function App(): Promise<void> {
    Console.success('Hello, world!')
}
