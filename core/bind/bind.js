import globalify from '@sky-modules/core/globalify';
export default function bind(target, propertyKey, descriptor
// eslint-disable-next-line @typescript-eslint/no-explicit-any
) {
    const key = Symbol();
    return {
        configurable: true,
        set(value_) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;
            this[key] = value_.bind(this);
        },
        get() {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (this[key] == null) {
                if (!descriptor) {
                    return undefined;
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;
                this[key] = descriptor.value.bind(this);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return this[key];
        },
    };
}
globalify({ bind });
//# sourceMappingURL=bind.js.map