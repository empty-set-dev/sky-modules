import globalify from 'sky/core/globalify'

import * as lib from './DI'

declare global {
    const Lifecycle: typeof lib.Lifecycle
    const autoInjectable: typeof lib.autoInjectable
    const container: typeof lib.container
    const delay: typeof lib.delay
    const inject: typeof lib.inject
    const injectAll: typeof lib.injectAll
    const injectAllWithTransform: typeof lib.injectAllWithTransform
    const injectWithTransform: typeof lib.injectWithTransform
    const injectable: typeof lib.injectable
    const instanceCachingFactory: typeof lib.instanceCachingFactory
    const instancePerContainerCachingFactory: typeof lib.instancePerContainerCachingFactory
    const isClassProvider: typeof lib.isClassProvider
    const isFactoryProvider: typeof lib.isFactoryProvider
    const isNormalToken: typeof lib.isNormalToken
    const isTokenProvider: typeof lib.isTokenProvider
    const isValueProvider: typeof lib.isValueProvider
    const predicateAwareClassFactory: typeof lib.predicateAwareClassFactory
    const registry: typeof lib.registry
    const scoped: typeof lib.scoped
    const singleton: typeof lib.singleton
}

globalify(lib)
