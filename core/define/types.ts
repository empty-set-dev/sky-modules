export function read<T>(schema: T): T {
    return schema
}
export function write<T>(schema: T): T {
    return schema
}
export function secret<T>(schema: T): T {
    return schema
}

// eslint-disable-next-line no-constant-condition
if (false) {
    boolean.type = undefined! as boolean
}

export function boolean(target: Object, key: string): void {
    target.schema ??= {}
    target.schema[key] = boolean
}

// eslint-disable-next-line no-constant-condition
if (false) {
    number.type = undefined! as number
}

export function number(target: Object, key: string): void {
    target.schema ??= {}
    target.schema[key] = number
}

// eslint-disable-next-line no-constant-condition
if (false) {
    string.type = undefined! as string
}

export function string(target: Object, key: string): void {
    target.schema ??= {}
    target.schema[key] = string
}

export function object<T extends Class | object>(
    schema: T
): (target: Object, key: string) => void {
    return (target: Object, key: string): void => {
        target.schema ??= {}
        target.schema[key] = schema
    }
}

export function array<T>(type: T): (target: Object, key: string) => void {
    return (target: Object, key: string): void => {
        target.schema ??= {}
        target.schema[key] = type
    }
}

export type func<T extends Function> = {
    type: T
}
export function func<T extends Function = () => void>(
    target: Object,
    key: string
): void & func<T> {
    target.schema ??= {}
    target.schema[key] = func<T>
}

optional.boolean = optional(boolean)
optional.number = optional(number)
optional.string = optional(string)
optional.func = optional(func)
export function optional<T>(schema: T): undefined | T {
    return schema
}

nullable.boolean = nullable(boolean)
nullable.number = nullable(number)
nullable.string = nullable(string)
nullable.func = nullable(func)
export function nullable<T>(schema: T): null | T {
    return schema
}

nullish.boolean = nullish(boolean)
nullish.number = nullish(number)
nullish.string = nullish(string)
nullish.func = nullish(func)
export function nullish<T>(schema: T): undefined | null | T {
    return schema
}
