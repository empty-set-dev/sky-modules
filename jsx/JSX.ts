/**
 * JSX type definitions and reactive primitives
 *
 * Re-exports Solid.js reactive primitives (createSignal, createEffect, etc.) and defines
 * JSX types for universal cross-framework component development.
 *
 * @module jsx/JSX
 */
export * from 'solid-js/dist/solid.js'

namespace JSX {
    export type FC<P = {}> = (props: P) => JSX.Element

    export interface ComponentClass<P = {}> {
        new (props: P): Component<P>
    }

    export interface Component<P = {}> {
        props: P
        render(): JSX.Element
    }

    export type Node = Element | Element[] | string | number | boolean | bigint | null | undefined

    export interface Element {
        type: string | Function
        key: null | string
        props: object
        children?: Node
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export type Return = any
}

export default JSX
