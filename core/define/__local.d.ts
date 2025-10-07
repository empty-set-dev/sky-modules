import __array from './__array';
import __makePlain from './__makePlain';
import { observe as __observe, unobserve as __unobserve } from './__observe';
import __reactivePropertyDescriptors from './__reactivePropertyDescriptors';
declare namespace local {
    const array: typeof __array;
    interface Static {
        [idSymbol]: number;
        [typeSymbol]: string;
        [nameSymbol]: string;
        [uidSymbol]: string;
    }
    interface Reactive {
        [listenersOfReactivitySymbol]: Set<unknown>;
    }
    interface Shared {
        [local.idSymbol]: number;
        [local.listenersOfShared]: Map<UpdateOfSharedCallback, number>;
        constructor: (new () => void) & {
            [local.idSymbol]: number;
            [local.nameSymbol]: string;
            [local.uidSymbol]: string;
        };
    }
    interface UpdateOfSharedCallback {
        (update: UpdateOfShared, prettyUpdate: UpdateOfShared.Pretty): void;
        create: Map<Shared, object>;
        set: Map<Shared, UpdateOfShared.primitive[]>;
        delete: Set<Shared>;
        isWaitingCommit: boolean;
    }
    const makePlain: typeof __makePlain;
    const observe: typeof __observe;
    const unobserve: typeof __unobserve;
    const reactivePropertyDescriptors: typeof __reactivePropertyDescriptors;
    type Defines = Record<string | symbol, number>;
    const constructorSymbol: unique symbol;
    const idSymbol: unique symbol;
    const typeSymbol: unique symbol;
    const nameSymbol: unique symbol;
    const uidSymbol: unique symbol;
    const listenersOfReactivitySymbol: unique symbol;
    const listenersOfShared: unique symbol;
    let uniqueId: number;
    let staticMaxId: number;
    const loadedDefines: Record<string, number>;
    const defines: Record<string, {
        name: string;
        value: Static;
    }>;
    const schemas: Record<string, unknown>;
    let reactions: Function[];
    const currentDefinesSymbol: unique symbol;
    const isHot: boolean;
}
export default local;
//# sourceMappingURL=__local.d.ts.map