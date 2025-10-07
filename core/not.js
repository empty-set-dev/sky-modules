var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let UndefinedError = class UndefinedError extends Error {
    constructor(message) {
        super(`unexpected undefined: ${message}`);
    }
};
UndefinedError = __decorate([
    define('sky.core.UndefinedError')
], UndefinedError);
export { UndefinedError };
define('sky.core.notUndefined', notUndefined);
export function notUndefined(value, message) {
    if (value === undefined) {
        throw new UndefinedError(message);
    }
    return value;
}
define('sky.core.assertIsNotUndefined', assertIsNotUndefined);
export function assertIsNotUndefined(value, message) {
    if (value === undefined) {
        throw new UndefinedError(message);
    }
}
let NullError = class NullError extends Error {
    constructor(message) {
        super(`unexpected null: ${message}`);
    }
};
NullError = __decorate([
    define('sky.core.NullError')
], NullError);
export { NullError };
define('sky.core.notNull', notNull);
export function notNull(value, message) {
    if (value === null) {
        throw new NullError(message);
    }
    return value;
}
define('sky.core.assertIsNotNull', assertIsNotNull);
export function assertIsNotNull(value, message) {
    if (value === null) {
        throw new NullError(message);
    }
}
let NullishError = class NullishError extends Error {
    constructor(message) {
        super(`unexpected nullish: ${message}`);
    }
};
NullishError = __decorate([
    define('sky.core.NullishError')
], NullishError);
export { NullishError };
define('sky.core.notNullish', notNullish);
export function notNullish(value, message) {
    if (value == null) {
        throw new NullishError(message);
    }
    return value;
}
define('sky.core.assertIsNotNullish', assertIsNotNullish);
export function assertIsNotNullish(value, message) {
    if (value == null) {
        throw new NullishError(message);
    }
    return value;
}
//# sourceMappingURL=not.js.map