import globalify from '@sky-modules/core/globalify'

import * as imports from '../jsx-universal'

declare global {
    const render: typeof imports.render
    const effect: typeof imports.effect
    const memo: typeof imports.memo
    const createComponent: typeof imports.createComponent
    const createElement: typeof imports.createElement
    const createTextNode: typeof imports.createTextNode
    const insertNode: typeof imports.insertNode
    const insert: typeof imports.insert
    const spread: typeof imports.spread
    const setProp: typeof imports.setProp
    const mergeProps: typeof imports.mergeProps
    const : typeof imports.
    const Fragment: typeof imports.Fragment
    const createSignal: typeof imports.createSignal
    const createEffect: typeof imports.createEffect
    const createMemo: typeof imports.createMemo
    const createRoot: typeof imports.createRoot
    const onCleanup: typeof imports.onCleanup
    const onMount: typeof imports.onMount
    const untrack: typeof imports.untrack
    const batch: typeof imports.batch
    const on: typeof imports.on
    const createContext: typeof imports.createContext
    const useContext: typeof imports.useContext
}

globalify({ ...imports })
