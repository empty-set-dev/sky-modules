import 'reflect-metadata'

iAm('standard.DI', import('./DI'))

declare global {
    interface Modules {
        'standard.DI': typeof import('./DI')
    }
}

export * from 'tsyringe'
import { autoInjectable, injectable, singleton } from 'tsyringe'

export const Singleton = singleton()
export const Injectable = injectable()
export const AutoInjectable = autoInjectable()
export function depends<T>(on: T): (target: Object, key: PropertyKey) => void {
    return function depends(target: Object, key: PropertyKey): void {
        Console.log(target, key)
    }
}
