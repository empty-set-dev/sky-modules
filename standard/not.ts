import globalify from 'sky/standard/globalify'

// declare global {
//     const UndefinedError: typeof lib.UndefinedError
//     const notUndefined: typeof lib.notUndefined
//     const NullError: typeof lib.NullError
//     const notNull: typeof lib.notNull
//     const NullishError: typeof lib.NullishError
//     const notNullish: typeof lib.notNullish
// }

// // KIND

namespace lib {
//     export class UndefinedError extends Error {
//         constructor(message?: string | Error) {
//             if (message != null) {
//                 super(`unexpected undefined: ${message}`)
//             } else if (message )
//         }
//     }
//     export function notUndefined<T>(value: undefined | T): T {
//         if (value === undefined) {
//             throw new UndefinedError()
//         }

//         return value
//     }
//     export class NullError extends Error {
//         constructor() {
//             super('unexpected null')
//         }
//     }
//     export function notNull<T>(value: null | T): T {
//         if (value === null) {
//             throw new NullError()
//         }

//         return value
//     }
//     export class NullishError extends Error {
//         constructor() {
//             super('unexpected nullish')
//         }
//     }
//     export function notNullish<T>(value: undefined | null | T): T {
//         if (value == null) {
//             throw new NullishError()
//         }

//         return value
//     }
}

globalify(lib)

console.log('123')
