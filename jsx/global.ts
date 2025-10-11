/* eslint-disable @typescript-eslint/no-explicit-any */
import globalify from '@sky-modules/core/globalify'
import * as Solid from 'solid-js'
import * as SolidStore from 'solid-js/store'
import * as SolidWeb from 'solid-js/web'

globalify({
    Sky: {
        // Core Solid.js functions
        createSignal: Solid.createSignal,
        createMemo: Solid.createMemo,
        createEffect: Solid.createEffect,
        createResource: Solid.createResource,
        createRoot: Solid.createRoot,
        createContext: Solid.createContext,
        useContext: Solid.useContext,
        children: Solid.children,
        untrack: Solid.untrack,
        batch: Solid.batch,
        on: Solid.on,
        onMount: Solid.onMount,
        onCleanup: Solid.onCleanup,
        catchError: Solid.catchError,
        createSelector: Solid.createSelector,
        lazy: Solid.lazy,
        Show: Solid.Show,
        For: Solid.For,
        Index: Solid.Index,
        Switch: Solid.Switch,
        Match: Solid.Match,
        ErrorBoundary: Solid.ErrorBoundary,
        Suspense: Solid.Suspense,
        SuspenseList: Solid.SuspenseList,

        // Store functions
        createStore: SolidStore.createStore,
        produce: SolidStore.produce,
        reconcile: SolidStore.reconcile,

        // Web functions
        render: SolidWeb.render,
        hydrate: SolidWeb.hydrate,
        renderToString: SolidWeb.renderToString,
        renderToStringAsync: SolidWeb.renderToStringAsync,
    },
})

declare global {
    namespace Sky {
        namespace JSX {
            type Element = Solid.JSXElement
        }

        // Core Solid.js types
        type Signal<T> = Solid.Signal<T>
        type Accessor<T> = Solid.Accessor<T>
        type Setter<T> = Solid.Setter<T>
        type Resource<T> = Solid.Resource<T>
        type Context<T> = Solid.Context<T>
        type Component<P extends Record<string, any> = {}> = Solid.Component<P>
        type JSXElement = Solid.JSXElement
        type ParentComponent<P extends Record<string, any> = {}> = Solid.ParentComponent<P>
        type FlowComponent<
            P extends Record<string, any> = {},
            C = Solid.JSXElement,
        > = Solid.FlowComponent<P, C>

        // Core functions
        const createSignal: typeof Solid.createSignal
        const createMemo: typeof Solid.createMemo
        const createEffect: typeof Solid.createEffect
        const createResource: typeof Solid.createResource
        const createRoot: typeof Solid.createRoot
        const createContext: typeof Solid.createContext
        const useContext: typeof Solid.useContext
        const children: typeof Solid.children
        const untrack: typeof Solid.untrack
        const batch: typeof Solid.batch
        const on: typeof Solid.on
        const onMount: typeof Solid.onMount
        const onCleanup: typeof Solid.onCleanup
        const catchError: typeof Solid.catchError
        const createSelector: typeof Solid.createSelector
        const lazy: typeof Solid.lazy

        // Components
        const Show: typeof Solid.Show
        const For: typeof Solid.For
        const Index: typeof Solid.Index
        const Switch: typeof Solid.Switch
        const Match: typeof Solid.Match
        const ErrorBoundary: typeof Solid.ErrorBoundary
        const Suspense: typeof Solid.Suspense
        const SuspenseList: typeof Solid.SuspenseList

        // Store functions
        const createStore: typeof SolidStore.createStore
        const produce: typeof SolidStore.produce
        const reconcile: typeof SolidStore.reconcile

        // Web functions
        const render: typeof SolidWeb.render
        const hydrate: typeof SolidWeb.hydrate
        const renderToString: typeof SolidWeb.renderToString
        const renderToStringAsync: typeof SolidWeb.renderToStringAsync
    }
}
