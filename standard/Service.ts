import './asyncCreate'
import './runtime'

import globalify from 'sky/standard/globalify'

declare global {
    const CircularDependencyInjectionError: typeof lib.CircularDependencyInjectionError
    const Service: typeof lib.Service
    const dependsOn: typeof lib.dependsOn
    const inject: typeof lib.inject
    const getService: typeof lib.getService
}
namespace local {
    export const serviceSymbol = Symbol('service')
    export const serviceOnErrorSymbol = Symbol('serviceOnError')
    export const serviceCreatePromiseSymbol = Symbol('serviceCreatePromise')
    export const promiseResolveSymbol = Symbol('promiseResolve')
    export const promiseServiceSymbol = Symbol('promiseService')
    export const injectsSymbol = Symbol('injects')

    export interface ServiceInstance {
        create?: (this: object) => void | Promise<void>
    }
    export type Service = (new () => ServiceInstance) & {
        [serviceSymbol]: true | ServiceInstance
        [serviceOnErrorSymbol]?: Error
        [serviceCreatePromiseSymbol]: ServiceCreatePromise
        [injectsSymbol]: ServiceCreatePromise[]
        [Symbol.asyncCreate]: Promise<ServiceInstance>
    }
    export type ServiceCreatePromise = Promise<ServiceInstance> & {
        [promiseResolveSymbol]: (serviceInstance: ServiceInstance) => void
        [promiseServiceSymbol]: Service
    }

    export function isService<T extends Class>(service: T): service is T & Service {
        as<Service>(service)

        return service[serviceSymbol] != null || service[serviceCreatePromiseSymbol] != null
    }

    export const services: Service[] = []

    export async function createService(service: Service): Promise<void> {
        if (service[serviceSymbol] === true) {
            throw new CircularDependencyInjectionError(service)
        }

        service[serviceSymbol] = true
        const serviceInstance = new service()

        if (service[injectsSymbol] != null) {
            for (const inject of service[injectsSymbol]) {
                const injectedService = inject[promiseServiceSymbol]

                if (injectedService[serviceSymbol] === true) {
                    throw new CircularDependencyInjectionError(service)
                } else if (injectedService[serviceSymbol] != null) {
                    continue
                }

                await createService(injectedService)
            }
        }

        if (serviceInstance.create != null) {
            await serviceInstance.create()
        }

        service[serviceSymbol] = serviceInstance
        service[serviceCreatePromiseSymbol][promiseResolveSymbol](serviceInstance)
    }
}

namespace lib {
    export class CircularDependencyInjectionError extends Error {
        constructor(service: local.Service) {
            super(`circular service dependency error in ${service.name}`)

            if (service[local.serviceOnErrorSymbol] != null) {
                this.message += `\nCaused by: ${service[local.serviceOnErrorSymbol]?.stack}`
            }
        }
    }

    export function Service<T extends Class>(target: T): T {
        as<local.Service>(target)
        target[local.serviceOnErrorSymbol] = Error('service')

        local.services.push(target)

        Object.setPrototypeOf(service, target)

        function service(): void {
            throw new Error('duplicated service')
        }

        return service as (() => void) & T
    }

    export function dependsOn(prototype: Object, key: PropertyKey): void {
        as<{ [p: PropertyKey]: local.ServiceInstance } & { constructor: Class }>(prototype)

        let injectValue: object
        let promise: null | local.ServiceCreatePromise = null
        Object.defineProperty(prototype, key, {
            get(): object {
                if (promise != null) {
                    throw new CircularDependencyInjectionError(promise[local.promiseServiceSymbol])
                }

                if (injectValue == null) {
                    throw new Error(`dependsOn: service not injected yet`)
                }

                return injectValue
            },
            set(value: object & local.ServiceCreatePromise): void {
                // TODO if set twice?
                if (value[local.promiseResolveSymbol] != null) {
                    promise = value

                    if (local.isService(prototype.constructor)) {
                        prototype.constructor[local.injectsSymbol] ??= []
                        prototype.constructor[local.injectsSymbol].push(promise)
                    }

                    task(async () => {
                        this[key] = await notNull(promise, 'promise')
                        promise = null
                    })
                }

                injectValue = value
            },
        })
    }

    export function inject(target: Object, key: PropertyKey): void {
        as<{ [p: PropertyKey]: local.ServiceInstance }>(target)

        let injectValue: object
        let promise: null | local.ServiceCreatePromise = null
        Object.defineProperty(target, key, {
            get(): object {
                if (promise != null) {
                    throw new Error(`inject: can't get service on create`)
                }

                return injectValue
            },
            set(value: object & local.ServiceCreatePromise): void {
                if (value[local.promiseResolveSymbol] != null) {
                    promise = value

                    task(async () => {
                        target[key] = await notNull(promise, 'inject: promise')
                        promise = null
                    })
                }

                injectValue = value
            },
        })
    }

    export function getService<T extends Class, T2>(
        Service: T,
        assert?: (service: unknown) => asserts service is T2
    ): InstanceType<T> & T2 {
        if (!isRuntime) {
            throw new Error(`can't get service before runtime`)
        }

        if (!local.isService(Service)) {
            throw new Error('not a service')
        }

        const service = Service[local.serviceSymbol]
        if (service != null && service !== true) {
            assert && assert(service)
            as<InstanceType<T> & T2>(service)
            return notNull(service, 'service')
        }

        const createPromise = Service[local.serviceCreatePromiseSymbol]
        if (createPromise != null) {
            as<InstanceType<T> & T2>(createPromise)
            assert && task(async () => {})
            return createPromise
        }

        throw new Error(`can't get service in index`)
    }
}

initServices()

function initServices(): void {
    task(async () => {
        await runtime

        for (const service of local.services) {
            const [promise, resolve] = Promise.new<local.ServiceInstance>()
            as<local.ServiceCreatePromise>(promise)
            promise[local.promiseResolveSymbol] = resolve
            promise[local.promiseServiceSymbol] = service
            service[local.serviceCreatePromiseSymbol] = promise
            service[Symbol.asyncCreate] = promise
        }

        for (const service of local.services) {
            if (service[local.serviceSymbol] === true) {
                throw new CircularDependencyInjectionError(service)
            } else if (service[local.serviceSymbol] != null) {
                continue
            }

            await local.createService(service)
        }

        for (const service of local.services) {
            delete service[local.serviceOnErrorSymbol]
        }
    })
}

globalify(lib)
