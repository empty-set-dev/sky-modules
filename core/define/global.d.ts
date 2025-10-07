import '@sky-modules/core/runtime';
import '@sky-modules/core/as';
import './_define';
import './_loadDefines';
import './_types';
import '@sky-modules/core/task';
declare global {
    interface Object {
        schema: Record<PropertyKey, unknown>;
    }
    interface Array<T> {
        schema: unknown[];
    }
}
//# sourceMappingURL=global.d.ts.map