export function isUndefined(value: unknown): value is undefined {
    return value === undefined
}
export function asUndefined(value: unknown): asserts value is null {
    if (!isUndefined(value)) {
        throw new Error('not an undefined')
    }
}

export function isNull(value: unknown): value is unknown {
    return value === null
}
export function asNull(value: unknown): asserts value is null {
    if (!isNull(value)) {
        throw new Error('not a null')
    }
}

export function isNullish(value: unknown): value is unknown {
    return value == null
}
export function asNullish(value: unknown): asserts value is undefined | null {
    if (!isNullish(value)) {
        throw new Error('not a nullish')
    }
}

export function isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean'
}
export function asBoolean(value: unknown): asserts value is boolean {
    if (!isBoolean(value)) {
        throw new Error('not a boolean')
    }
}

export function isNumber(value: unknown): value is number {
    return typeof value === 'number'
}
export function asNumber(value: unknown): asserts value is number {
    if (!isNumber(value)) {
        throw new Error('not a number')
    }
}

export function isBigInt(value: unknown): value is bigint {
    return typeof value === 'bigint'
}
export function asBigInt(value: unknown): asserts value is bigint {
    if (!isBigInt(value)) {
        throw new Error('not a bigint')
    }
}

export function isSymbol(value: unknown): value is symbol {
    return typeof value === 'symbol'
}
export function asSymbol(value: unknown): asserts value is symbol {
    if (!isSymbol(value)) {
        throw new Error('not a symbol')
    }
}

export function isString(value: unknown): value is string {
    return typeof value === 'string'
}
export function asString(value: unknown): asserts value is string {
    if (!isString(value)) {
        throw new Error('not a string')
    }
}

export function isTemplateStringsArray(value: unknown): value is TemplateStringsArray {
    return Array.isArray(value) && Array.isArray((<{ raw: string[] }>(<unknown>value)).raw)
}
export function asTemplateStringsArray(value: unknown): asserts value is TemplateStringsArray {
    if (!isTemplateStringsArray(value)) {
        throw new Error('not a template string array')
    }
}

export function isArray(value: unknown): value is unknown[] {
    return Array.isArray(value)
}
export function asArray(value: unknown): asserts value is unknown[] {
    if (!isArray(value)) {
        throw new Error('not an array')
    }
}

export function isObject(value: unknown): value is object {
    return !isArray(value) && value !== null && typeof value === 'object'
}
export function asObject(value: unknown): asserts value is object {
    if (!isObject(value)) {
        throw new Error('not an object')
    }
}

export function isFunction(value: unknown): value is Function {
    return typeof value === 'function'
}
export function asFunction(value: unknown): asserts value is Function {
    if (!isFunction(value)) {
        throw new Error('not a function')
    }
}
