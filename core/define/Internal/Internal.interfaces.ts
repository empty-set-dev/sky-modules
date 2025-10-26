import type * as symbols from './Internal.symbols'

// Interface for static objects/functions registered with define()
export interface Static {
    [symbols.idSymbol]: number
    [symbols.typeSymbol]: string
    [symbols.nameSymbol]: string
    [symbols.uidSymbol]: string
}

// Interface for reactive objects that track listeners
export interface Reactive {
    [symbols.listenersOfReactivitySymbol]: Set<unknown>
}

// Interface for shared objects with synchronization callbacks
export interface Shared {
    [symbols.idSymbol]: number
    [symbols.listenersOfShared]: Map<unknown, number>
    constructor: (new () => void) & {
        [symbols.idSymbol]: number
        [symbols.nameSymbol]: string
        [symbols.uidSymbol]: string
    }
}

// Type for define registry entries
export type Defines = Record<string | symbol, number>
